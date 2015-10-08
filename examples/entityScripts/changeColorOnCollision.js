/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/
//
//  changeColorOnCollision.js
//  examples/entityScripts
//
//  Created by Brad Hefta-Gaub on 12/8/14.
//  Copyright 2014 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function(){ 
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.collisionWithEntity = function(myID, otherID, collisionInfo) { 
        Entities.editEntity(myID, { color: { red: getRandomInt(128,255), green: getRandomInt(128,255), blue: getRandomInt(128,255)} });
    }; 
})