//  createLaneComputer.js
//  part of bowling
//
//  Script Type: Entity Spawner
//  Created by James B. Pollack @imgntn -- 09/11/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  Creates a lane computer in the scene near your avatar, which allows you to start the bowling game.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, Audio, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Paths, Clipboard, Settings, XMLHttpRequest, randFloat, randInt */

Script.include("../../utilities.js");
Script.include("../../libraries/utils.js");

var laneComputerModel = 'http://hifi-public.s3.amazonaws.com/james/bowling/models/laneComputer/computer.fbx?' + randInt(0, 10000);
var scriptURL =Script.resolvePath("laneComputer.js");
var center = Vec3.sum(MyAvatar.position, Vec3.multiply(1, Quat.getFront(Camera.getOrientation())));

var laneComputer = Entities.addEntity({
    type: "Box",
  //  modelURL: laneComputerModel,
    position: center,
    dimensions: {
        x: 1,
        y: 1,
        z: 1
    },
    collisionsWillMove: false,
    script: scriptURL,
    visible:false
});

function cleanup() {
    Entities.deleteEntity(laneComputer);
}


Script.scriptEnding.connect(cleanup);