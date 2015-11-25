//
//  createFlashlight.js
//  examples/entityScripts
//
//  Created by Sam Gateau on 9/9/15.
//  Copyright 2015 High Fidelity, Inc.
//
//  This is a toy script that create a flashlight entity that lit when grabbed
//  This can be run from an interface and the flashlight will get deleted from the domain when quitting
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Paths, Clipboard, Settings, XMLHttpRequest, randFloat, randInt */
Script.include("https://hifi-public.s3.amazonaws.com/scripts/utilities.js");


var scriptURL = Script.resolvePath('flashlight.js');

var modelURL = "https://hifi-public.s3.amazonaws.com/models/props/flashlight.fbx";


var startPosition = SOMEHOW.PARSE.HOW.I.WAS.LOADED;
var startRotation = SOMEHOW.PARSE.HOW.I.WAS.LOADED;
var addToScene = SOMEHOW.PARSE.HOW.I.WAS.LOADED || null;

var flashlight = Entities.addEntity({
    type: "Model",
    modelURL: modelURL,
    position: startPosition,
    rotation: startRotation,
    dimensions: {
        x: 0.08,
        y: 0.30,
        z: 0.08
    },
    collisionsWillMove: true,
    shapeType: 'box',
    script: scriptURL
});

if (addToScene !== null) {
    Messages.sendMessage('Hifi-Scene-Add', flashlight);
}