//
//  racket.js
//
//  This script attaches to a tennis racket that you can pick up with a hand controller.
//  Created by James B. Pollack @imgntn on 10/19/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
// how to do this w/o collision groups?  held racket will collide with avatar

(function() {

    Script.include("../../libraries/utils.js");

    var DRAW_STRING_THRESHOLD = 0.80;

    var RACKET_SPATIAL_KEY = {
        relativePosition: {
            x: 0,
            y: 0.06,
            z: 0.11
        },
        relativeRotation: Quat.fromPitchYawRollDegrees(0, -90, 90)
    }


    var USE_DEBOUNCE = false;

    var TRIGGER_CONTROLS = [
        Controller.Standard.LT,
        Controller.Standard.RT,
    ];

    function interval() {
        var lastTime = new Date().getTime();

        return function getInterval() {
            var newTime = new Date().getTime();
            var delta = newTime - lastTime;
            lastTime = newTime;
            return delta;
        };
    }

    var checkInterval = interval();

    var _this;

    function Racket() {
        _this = this;
        return;
    }

    Racket.prototype = {
        isGrabbed: false,
        sinceLastUpdate: 0,
        preload: function(entityID) {
            this.entityID = entityID;

        },

        unload: function() {


        },

        setLeftHand: function() {
            if (this.isGrabbed === true) {
                return false;
            }
            this.hand = 'left';
        },

        setRightHand: function() {
            if (this.isGrabbed === true) {
                return false;
            }
            this.hand = 'right';
        },

        startNearGrab: function() {

            print('START Racket GRAB')
            if (this.isGrabbed === true) {
                return false;
            }

            this.isGrabbed = true;

            this.initialHand = this.hand;

            //disable the opposite hand in handControllerGrab.js by message
            var handToDisable = this.initialHand === 'right' ? 'left' : 'right';
            Messages.sendMessage('Hifi-Hand-Disabler', handToDisable);

            setEntityCustomData('grabbableKey', this.entityID, {
                grabbable: false,
                invertSolidWhileHeld: false,
                spatialKey: BOW_SPATIAL_KEY
            });

        },
        continueNearGrab: function() {
            this.deltaTime = checkInterval();

            //debounce during debugging -- maybe we're updating too fast?
            if (USE_DEBOUNCE === true) {
                this.sinceLastUpdate = this.sinceLastUpdate + this.deltaTime;

                if (this.sinceLastUpdate > 60) {
                    this.sinceLastUpdate = 0;
                } else {
                    return;
                }
            }

            this.bowProperties = Entities.getEntityProperties(this.entityID);

            this.checkStringHand();

        },

        releaseGrab: function() {
            //  print('RELEASE GRAB EVENT')
            if (this.isGrabbed === true && this.hand === this.initialHand) {

                Messages.sendMessage('Hifi-Beam-Disabler', "none")

                setEntityCustomData('grabbableKey', this.entityID, {
                    grabbable: true,
                    invertSolidWhileHeld: false,
                    spatialKey: BOW_SPATIAL_KEY
                });



            }
        },

        checkStringHand: function() {
            //invert the hands because our string will be held with the opposite hand of the first one we pick up the bow with
            var triggerLookup;
            if (this.initialHand === 'left') {
                triggerLookup = 1;
                this.getStringHandPosition = MyAvatar.getRightPalmPosition;
            } else if (this.initialHand === 'right') {
                this.getStringHandPosition = MyAvatar.getLeftPalmPosition;
                triggerLookup = 0;
            }

            this.triggerValue = Controller.getValue(TRIGGER_CONTROLS[triggerLookup]);


            if (this.triggerValue < DRAW_STRING_THRESHOLD && this.stringDrawn === true) {
                // firing the arrow
                //  print('HIT RELEASE LOOP IN CHECK');



            } else if (this.triggerValue > DRAW_STRING_THRESHOLD && this.stringDrawn === true) {
                //    print('HIT CONTINUE LOOP IN CHECK')
                //continuing to aim the arrow

     

            } else if (this.triggerValue > DRAW_STRING_THRESHOLD && this.stringDrawn === false) {
                // print('HIT START LOOP IN CHECK');
   

            }
        }


    };

    return new Bow();
});