//
//  createRacket.js
//
//  Created byJames Pollack @imgntn on 10/19/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  This script creates a racket you can use to play tennis.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


var SCRIPT_URL = Script.resolvePath('racket.js');

var MODEL_URL = "http://hifi-content.s3.amazonaws.com/james/tennis/models/racket.fbx";
var COLLISION_HULL_URL = "http://hifi-content.s3.amazonaws.com/james/tennis/models/racket_collision_hull.obj";
var RACKET_DIMENSIONS = {
    x: 0.04,
    y: 1.3,
    z: 0.21
};

var RACKET_GRAVITY = {
    x: 0,
    y: 0,
    z: 0
}

var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0.5,
    z: 0
}), Vec3.multiply(1, Quat.getFront(Camera.getOrientation())));

var racket = Entities.addEntity({
    name: 'Hifi-Tennis-Racket',
    type: "Model",
    modelURL: MODEL_URL,
    position: center,
    dimensions: RACKET_GRAVITY_DIMENSIONS,
    collisionsWillMove: true,
    gravity: RACKET_GRAVITY_GRAVITY,
    shapeType: 'compound',
    compoundShapeURL: COLLISION_HULL_URL,
    script: SCRIPT_URL,
    userData: JSON.stringify({
        grabbableKey: {
            invertSolidWhileHeld: false,
            spatialKey: {
                relativePosition: {
                    x: 0,
                    y: 0.06,
                    z: 0.11
                },
                relativeRotation: Quat.fromPitchYawRollDegrees(0, -90, 90)
            }
        }
    })
});

function cleanup() {
    Entities.deleteEntity(racket);
}

Script.scriptEnding.connect(cleanup);