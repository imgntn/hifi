// Generic flocking behavior
(function() {
    // Simple flocking simulation.
    // // Not tested (yet), and can be optimized as needed.
    // function Flock() {
    //     // List of entities we're simulating. For simplicity, we do not care about their current
    //     // state (Entity.getProperties), and only send updates (Entity.editEntity). Furthermore, 
    //     // it's left up to the caller to ensure that our simulation instance is only called by one
    //     // thread.
    //     this.simulatedEntities = [];

    //     // List of flocking rules, which implement the actual flocking behavior
    //     this.rules = {};
    // }


    Flock = function(entityID) {
        print('fish constructor')
        _t = this;
        this.entityID = entityID;
        this.properties = Entities.getEntityProperties(entityID);
        this.simulatedEntities = [];
        this.rules = {};
    }

    // Attach a flocking rule.
    // @param name: unique identifier for the rule (rules can be added and deleted)
    // @param rule: function with params (flock, i, j)
    //      i: index of this object
    //      j: index of 'other' object (gets called for each i, j in [0, entities.length])
    //      flock: object
    //      flock.velocities: mutable array of Vec3 velocities
    //      flock.positions:  immutable array of Vec3 positions
    //      flock.center: center of the flock
    Flock.prototype.attachRule = function(name, rule) {
        this.rules[name] = rule;
    }
    Flock.prototype.removeRule = function(name) {
            delete this.rules[name];
            //         var ruleIndex = this.rules.indexOf(name);
            //       if (ruleIndex > -1) {
            //     array.splice(index, 1);
            // }
        }
        // Add an entity to the simulation.
        // @param entityId: the entity
        // @param hasOwnership (optional): signifies if we're allowed to delete this entity or
        //      not (true => yes, false => no). Defaults to false.

    var ZERO_VECTOR = {
        x: 0,
        y: 0,
        z: 0
    }

    Flock.prototype.attachEntity = function(entityId, hasOwnership) {
            var properties = Entities.getEntityProperties(entityId);
            this.simulatedEntities.push({
                entityId: entityId,
                position: properties.position,
                velocity: properties.velocity,
                owned: !!hasOwnership
            });
        }
        // Remove an entity from the simulation (by id).
        // Calls Entities.deleteEntity iff its ownership flag is set (from the attachEntity call)
    Flock.prototype.removeEntity = function(entityId, deleteEntity) {
            // Find and remove entity
            for (var i = 0; i < this.simulatedEntities.length; ++i) {
                if (this.simulatedEntities[i].entityId === entityId) {
                    if (this.simulatedEntities[i].owned) {
                        Entities.deleteEntity(this.simulatedEntities[i]);
                    }
                    this.simulatedEntities.removeAtIndex(i); // added by arrayUtils.js
                    return;
                }
            }
            // else -- entity doesn't exist. do we care?
        }
        // Destroys the simulation.
        // Kills all entities we have ownership over.
    Flock.prototype.destroy = function() {
            this.simulatedEntities.forEach(function(entity) {
                if (entity.hasOwnership) {
                    Entities.deleteEntity(entity.entityId);
                }
            });
            this.simulatedEntities = [];
        }
        // Run the simulation.
        // Should be called every frame update / as fast as possible.
    Flock.prototype.simulate = function(dt) {
       
        var entities = _t.simulatedEntities;

        var N = entities.length;

        // Calculate flock center (averaged positions)
        var center = {
            x: 0,
            y: 0,
            z: 0
        };

        entities.forEach(function(entity) {
            Vec3.sum(center, entity.position)

        })

        Vec3.multiply(center, 1 / N)


        // Get position + velocity arrays
        var positions = entities.map(function(entity) {
            return entity.position
        });
        var velocities = entities.map(function(entity) {
            return entity.velocity
        });
        var rules = Object.keys(_t.rules).map(function(k) {
            return _t.rules[k];
        });


        var flock = {
            center: center,
            position: positions,
            velocity: velocities
        };

        // Apply flocking rules
        rules.forEach(function(rule) {
            for (var i = 0; i < N; ++i) {
                for (var j = i + 1; j < N; ++j) {
                    rule.call(null, flock, i, j);
                    rule.call(null, flock, j, i);
                }
            }
        });

        // Integrate + apply positions + velocities
        entities.forEach(function(entity) {
            // Clamp velocity to max speed
            var currentSpeed = Vec3.length(entity.velocity);
            if (currentSpeed > this.MAX_SPEED) {
                Vec3.multiply(entity.velocty, _t.MAX_SPEED / currentSpeed);

            }

            // Update position w/ velocity
            var velocityClone = Vec3.multiply(entity.velocity, dt);
            var entityPosition = Vec3.sum(entity.position, velocityClone)



            Entities.editEntity(entity.entityId, {
                position: entityPosition,
                velocity: velocityClone
            });
        }, this);
    }


    // Attach methods
    // inject(Flock.prototype, { // inject.js
    //     attachEntity: attachEntity,
    //     removeEntity: removeEntity,
    //     addRule: addRule,
    //     removeRule: removeRule,
    //     simulate: simulate,
    //     destroy: destroy,
    //     MAX_SPEED: DEFAULT_MAX_SPEED,
    // });

    // Export to global scope.
    // Could be done async (AMD, etc)
    // inject(this, {
    //     Flock: Flock
    // });


    // Basic usage (needs to be tested!)

    var flock = new Flock();

    // Create 10 entities
    for (var i = 0; i < 10; ++i) {
        flock.attachEntity(
            Entities.addEntity({
                type: 'Sphere',
                dimensions: {
                    x: 1,
                    y: 1,
                    z: 1
                },
                position: {
                    x: MyAvatar.position.x + (i * 2),
                    y: MyAvatar.position.y + (i * 2),
                    z: MyAvatar.position.z + (i * 2),
                },
                color: {

                    red: 0,
                    green: 0,
                    blue: 255
                }
            }), true);
    }

    // Attach rules
    flock.attachRule('cluster', function(flock, i) {

    });
    flock.attachRule('separation', function(flock, i, j) {

    });
    flock.attachRule('alignment', function(flock, i, j) {

    });

    // limit speed to some defined value
    flock.MAX_SPEED = 10.0;

    // Run simulation + attach cleanup
    Script.update.connect(flock.simulate);
    Script.scriptEnding.connect(flock.destroy);
})();