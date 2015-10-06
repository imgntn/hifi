//  rollDetector.js
//  part of bowling
//
//  Script Type: Entity
//
//  Created by James B. Pollack @imgntn -- 09/11/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  When the ball enters this area, it's been rolled through to the end of the lane
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, Audio, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Paths, Clipboard, Settings, XMLHttpRequest, randFloat, randInt */

(function() {
    Script.include("../../utilities.js");
    Script.include("../../libraries/utils.js");

    var _t;

    RollDetector = function() {
        _t = this;
        print("RollDetector constructor ");
    };

    RollDetector.prototype = {
        properties: null,
        preload: function(entityID) {
            //  print('bubble preload')
            _t.entityID = entityID;
            properties = Entities.getEntityProperties(entityID);
            Script.update.connect(_t.internalUpdate);
        },
        update: function() {
            _t.properties = Entities.getEntityProperties(_t.entityID);
        },
        collisionWithEntity: function(myID, otherID, collision) {
            //if i am hit by a bowling ball
            //write something to my user data about being done, check that from the 
        },
        unload: function(entityID) {
            Script.update.disconnect(update);
        }
    };

    return new RollDetector();

});