//
//  slider.js
//
//  Created by James Pollack @imgntn on 12/15/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  Entity script that sends a scaled value to a light based on its distance from the start of its constraint axis.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {

    var AXIS_SCALE = 1;

    function Slider() {
        return this;
    }

    Slider.prototype = {
        preload: function(entityID) {
            this.entityID = entityID;
            var entityProperties = Entities.getEntityProperties(this.entityID, "userData");
            var parsedUserData = JSON.parse(entityProperties.userData);
            this.userData = parsedUserData.genericSliderKey;
        },
        startNearGrab: function() {
            this.setInitialProperties();
        },
        startDistantGrab: function() {
            this.setInitialProperties();
        },
        setInitialProperties: function() {
            this.initialProperties = Entities.getEntityProperties(this.entityID);
        },
        continueNearGrab: function() {
            //  this.continueDistantGrab();
        },
        continueDistantGrab: function() {
            this.setSliderValueBasedOnDistance();
        },
        setSliderValueBasedOnDistance: function() {
            var currentPosition = Entities.getEntityProperties(this.entityID, "position").position;

            var distance = Vec3.distance(this.userData.axisStart, currentPosition);
            var MAX_VALUE =this.userData.exposedPropertyMaximum;

            this.sliderValue = this.scaleValueBasedOnDistanceFromStart(distance, 0, MAX_VALUE);
            this.sendValueToSlider();
        },
        releaseGrab: function() {
            Entities.editEntity(this.entityID, {
                velocity: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                angularVelocity: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            })

            this.sendValueToSlider();
        },
        scaleValueBasedOnDistanceFromStart: function(value, min2, max2) {
            var min1 = 0;
            var max1 = AXIS_SCALE;
            var min2 = min2;
            var max2 = max2;
            return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
        },
        sendValueToSlider: function() {
            var _t = this;
            var message = {
                entityToModify: _t.userData.entityToModify,
                propertyToModify: _t.userData.propertyToModify,
                sliderValue: _t.sliderValue
            }
            
            Messages.sendMessage('Hifi-Slider-Value-Reciever', JSON.stringify(message));
            // if (_t.userData.propertyToModify === 'cutoff') {
            //     Messages.sendMessage('entityToolUpdates', 'callUpdate');
            // }
        }
    };

    return new Slider();
});