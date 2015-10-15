//
//  firePropogator.js
//  examples
//
//  Created by James B. Pollack @imgntn on 10/15/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  Creates an ephemeral flickering light that will randomly flicker as long as the script is running.
//  After the script stops running, the light will eventually disappear (~10 seconds later). This script
//  can run in the interface or in an assignment client and it will work equally well.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


function randFloat(low, high) {
    return low + Math.random() * (high - low);
}


var totalTime = 0;
var lastUpdate = 0;
var UPDATE_INTERVAL = 1 / 30; // 30fps

var EPHEMERAL_LIFETIME = 60;



var FIRE_RANGE = 2;
var FIRE_INTENSITY = 2;
var BURNS_AT = 20;

var FIRE_DIMENSIONS = {
    x: 1,
    y: 1,
    z: 1
}

var INITIAL_FIRE_PROPERTIES = {
        name: 'Fire',
        type: 'Box',
        visible: false,
        dimensions: FIRE_DIMENSIONS,
        userData: JSON.stringify({
            fireKey: {
                isFire: true
                isFuel: false
            }
        })
    }
    // find fires
    // for each fire, find fuel sources
    // for each fuel source, add some heat
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
            userData: newUserData
        })

        return true;
    },
    spawnFireAtBurningFuelSource: function(position) {
        var properties = INITIAL_FIRE_PROPERTIES;
        properties.posiition = position;
        Entities.addEntity(properties)
    },
    init: function() {
        var fires = this.findFires();
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

var hasSpawned = false;

function update(deltaTime) {

    if (!Entities.serversExist() || !Entities.canRez()) {
        return;
    }

    if (hasSpawned === false) {
        hasSpawned = true;
        LightMaker.spawnLight();
    } else {
        totalTime += deltaTime;

        // We don't want to edit the entity EVERY update cycle, because that's just a lot
        // of wasted bandwidth and extra effort on the server for very little visual gain
        if (totalTime - lastUpdate > UPDATE_INTERVAL) {
            var intensity = (MINIMUM_LIGHT_INTENSITY + (MAXIMUM_LIGHT_INTENSITY + (Math.sin(totalTime) * MAXIMUM_LIGHT_INTENSITY)));
            intensity += randFloat(-LIGHT_INTENSITY_RANDOMNESS, LIGHT_INTENSITY_RANDOMNESS);
            var properties = Entities.getEntityProperties(LightMaker.light, "age");
            var newLifetime = properties.age + EPHEMERAL_LIFETIME;
            Entities.editEntity(LightMaker.light, {
                type: "Light",
                intensity: intensity,
                lifetime: newLifetime
            });
            lastUpdate = totalTime;
        }
    }
}

Script.update.connect(update);