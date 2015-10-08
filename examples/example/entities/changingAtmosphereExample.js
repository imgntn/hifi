/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/
//
//  changingAtmosphereExample.js
//  examples
//
//  Created by Brad Hefta-Gaub on 4/16/15.
//  Copyright 2015 High Fidelity, Inc.
//
//  This is an example script that demonstrates creating a zone using the atmosphere features that changes scatter properties
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

HIFI_PUBLIC_BUCKET = "http://s3.amazonaws.com/hifi-public/";

var count = 0;
var stopAfter = 10000;

var zoneEntityA = Entities.addEntity({
    type: "Zone",
    position: { x: 1000, y: 1000, z: 1000}, 
    dimensions: { x: 2000, y: 2000, z: 2000 },
    keyLightColor: { red: 255, green: 0, blue: 0 },
    stageSunModelEnabled: false,
    shapeType: "sphere",
    backgroundMode: "atmosphere",
    atmosphere: {
        center: { x: 1000, y: 0, z: 1000}, 
        innerRadius: 1000.0,
        outerRadius: 1025.0,
        rayleighScattering: 0.0025, // Meaningful values 0 to ~0.01
        mieScattering: 0.0010, // Meaningful values 0 to ~0.01
        
        // First two, Meaningful values 0 to 1 each, blue, purple; third meaningful 0.3 to 1 - affects shape
        scatteringWavelengths: { x: 0.650, y: 0.570, z: 0.475 },  
        hasStars: true
    },
    stage: {
        latitude: 37.777,
        longitude: 122.407,
        altitude: 0.03,
        day: 183,
        hour: 5,
        sunModelEnabled: true
    }
});


// register the call back so it fires before each data send
Script.update.connect(function(deltaTime) {
    // stop it...
    if (count >= stopAfter) {
        print("calling Script.stop()");
        Script.stop();
    }
    count++;
    var rayleighScattering = (count / 100000) % 0.01;
    var mieScattering = (count / 100000) % 0.01;
    var waveX = (count / 2000) % 1;
    var waveZ = ((count / 2000) % 0.7) + 0.3;
    
    Entities.editEntity(zoneEntityA, { 
        atmosphere: {
            rayleighScattering: rayleighScattering,
            mieScattering: mieScattering,
            scatteringWavelengths: { x: waveX, y: waveX, z: waveZ }
        },

    });
});

