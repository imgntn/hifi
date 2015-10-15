//
//  firePropogator.js
//  examples
//
//  Created by James B. Pollack @imgntn on 10/15/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var totalTime = 0;
var lastUpdate = 0;
var UPDATE_INTERVAL = 1 / 30; // 30fps

var EPHEMERAL_LIFETIME = 60;

var FIRE_RANGE = 10;
var FIRE_INTENSITY = 2;
var BURNS_AT = 20;

var FIRE_DIMENSIONS = {
    x: 1,
    y: 1,
    z: 1
};

var INITIAL_FIRE_PROPERTIES = {
    name: 'Fire',
    type: 'Box',
    visible: false,
    dimensions: FIRE_DIMENSIONS,
    userData: JSON.stringify({
        fireKey: {
            isFire: true,
            isFuel: false
        }
    })
};

var newFires = [];
// search for fires 
// for each fire, search for fuel sources
// for each fuel source, add some heat
// if heat is above burns_at threshold, start a fire there and set isBurning:true because fuel source is used up
var FirePropagator = {
    searchRange: 100,
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    findFires: function() {
        var fires = [];
        var ids = Entities.findEntities(position, this.searchRange);
        var i;
        for (i = 0; i < ids.length; i++) {
            var id = ids[i];
            var properties = Entities.getEntityProperties(id, ["userData", "position", "age"]);
            var userData = JSON.parse(properties.userData);
            if (typeof userData.fireKey !== 'undefined') {
                if (userData.fireKey.isFire === true) {
                    fires.push({
                        fireSourceID: id,
                        fireSourcePosition: properties.position
                    });
                }
            }
        }
        return fires;
    },
    findFuelSources: function(position) {
        var fuelSources = [];
        var ids = Entities.findEntities(position, FIRE_RANGE);
        var i;
        for (i = 0; i < ids.length; i++) {
            var id = ids[i];
            var properties = Entities.getEntityProperties(id, ["userData", "position"]);
            var userData = JSON.parse(properties.userData);
            if (typeof userData.fireKey !== 'undefined') {
                if (userData.fireKey.isFuel === true) {
                    fuelSources.push({
                        fuelSourceID: id,
                        fuelSourceData: userData.fireKey,
                        fuelSourcePosition: properties.position
                    });
                }
            }
        }
        return fuelSources;
    },
    addHeatToFuelSource: function(fuelSource) {
        var initialHeatIndex = fuelSource.fuelSourceData.heatIndex;
        var newHeatIndex = initialHeatIndex += FIRE_INTENSITY;
        var isBurning;
        var lifetime;
        if (newHeatIndex > BURNS_AT) {
            isBurning = true;
            this.spawnFireAtBurningFuelSource(fuelSource.position)
        } else {
            isBurning = false;
        }
        var newUserData = {
            fireKey: {
                isFuel: true,
                isFire: false,
                heatIndex: newHeatIndex,
                isBurning: isBurning
            }
        };

        Entities.editEntity(fuelSource.fuelSourceID, {
            userData: JSON.stringify(newUserData)
        })

        return true;
    },
    spawnFireAtBurningFuelSource: function(position) {
        var properties = INITIAL_FIRE_PROPERTIES;
        properties.posiition = position;
        var newFire = Entities.addEntity(properties);
        newFires.push(newFire)
    },
    updateFires: function() {
        var fires = this.findFires();
        print('FOUND FIRES:::'+fires.length)
        fires.forEach(function(fire) {
            var fuelSources = this.findFuelSources(fire.fireSourcePosition);
            fuelSources.forEach(function(fuelSource) {
                if (fuelSource.userData.isBurning !== true) {
                    this.addHeatToFuelSource(fuelSource);
                }
            }, index)
        }, index)
    }
}

function update(deltaTime) {

    if (!Entities.serversExist() || !Entities.canRez()) {
        return;
    }

    totalTime += deltaTime;

    // We don't want to edit the entity EVERY update cycle, because that's just a lot
    // of wasted bandwidth and extra effort on the server for very little visual gain
    if (totalTime - lastUpdate > UPDATE_INTERVAL) {

        //DO STUFF
        FirePropagator.updateFires();

        lastUpdate = totalTime;
    }

}


function cleanup() {
    while (newFires.length > 0) {
        Entities.deleteEntity(newFires.pop());
    }
    Script.update.disconnect(update);
}
Script.update.connect(update);
Script.scriptEnding.connect(cleanup);