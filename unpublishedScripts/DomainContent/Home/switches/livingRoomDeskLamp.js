(function() {
    var SEARCH_RADIUS = 10;

    var _this;
    Script.include('atp:/scripts/utils.js');
    Switch = function() {
        _this = this;
        this.switchSound = SoundCache.getSound("https://hifi-public.s3.amazonaws.com/sounds/Switches%20and%20sliders/lamp_switch_2.wav");
    };

    Switch.prototype = {
        lightName: "home_light_livingRoomDeskLampLight",
        modelName: 'home_model_livingRoomDeskLampModel',
        clickReleaseOnEntity: function(entityID, mouseEvent) {
            if (!mouseEvent.isLeftButton) {
                return;
            }
            this.toggleLights();
        },

        startNearTrigger: function() {
            this.toggleLights();
        },

        modelEmitOn: function(discModel) {
      
        },

        modelEmitOff: function(discModel) {
     
        },

        masterLightOn: function(masterLight) {
              print("EBL TURN LIGHT ON");
            Entities.editEntity(masterLight, {
                visible: true
            });
        },

        masterLightOff: function(masterLight) {
            print("EBL YANA TURN LIGHT OFF");
            Entities.editEntity(masterLight, {
                visible: false
            });
        },


        findMasterLights: function() {
            var found = [];
            var results = Entities.findEntities(_this.position, SEARCH_RADIUS);
            results.forEach(function(result) {
                var properties = Entities.getEntityProperties(result);
                if (properties.name === _this.lightName) {
                    print("EBL FOUND THE BULLDOG LIGHT!");
                    found.push(result);
                }
            });
            return found;
        },

        findEmitModels: function() {
            var found = [];
            var results = Entities.findEntities(this.position, SEARCH_RADIUS);
            results.forEach(function(result) {
                var properties = Entities.getEntityProperties(result);
                if (properties.name === _this.modelName) {
                    found.push(result);
                }
            });
            return found;
        },

        toggleLights: function() {

            this._switch = getEntityCustomData('home-switch', this.entityID, {
                state: 'off'
            });

            var masterLights = this.findMasterLights();
            var emitModels = this.findEmitModels();
            if (_this._switch.state === 'off') {
                masterLights.forEach(function(masterLight) {
                    _this.masterLightOn(masterLight);
                });
                emitModels.forEach(function(emitModel) {
                    _this.modelEmitOn(emitModel);
                });
               print("SHNUUUR  TURN ON SWITCH");
                setEntityCustomData('home-switch', _this.entityID, {
                    state: 'on'
                });

            } else {
                masterLights.forEach(function(masterLight) {
                    _this.masterLightOff(masterLight);
                });
                emitModels.forEach(function(emitModel) {
                    _this.modelEmitOff(emitModel);
                });
                print("SHNUUUR  TURN OFF SWITCH");
                setEntityCustomData('home-switch', _this.entityID, {
                    state: 'off'
                });
            }

            Audio.playSound(this.switchSound, {
                volume: 0.5,
                position: this.position
            });

        },


        preload: function(entityID) {
            print("EBL  YAYAYAY PRELOAD BULLDOG HBBBBIIIIIDYYY")
            this.entityID = entityID;
            setEntityCustomData('grabbableKey', this.entityID, {
                wantsTrigger: true
            });

            var properties = Entities.getEntityProperties(this.entityID);


            //The light switch is static, so just cache its position once
            this.position = Entities.getEntityProperties(this.entityID, "position").position;
        }
    };

    // entity scripts always need to return a newly constructed object of our type
    return new Switch();
});