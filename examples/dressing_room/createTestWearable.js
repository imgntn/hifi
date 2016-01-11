//
//  createTestWearable.js
//
//  Created by James B. Pollack @imgntn on 1/7/2016
//  Copyright 2016 High Fidelity, Inc.
//
//  This script shows how to hook up a model entity to your avatar to act as a doppelganger.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0.5,
    z: 0
}), Vec3.multiply(0.5, Quat.getFront(Camera.getOrientation())));


var wearable;

function createWearable() {
    var properties = {
        type: 'Model',
        modelURL:'https://s3.amazonaws.com/hifi-public/tony/cowboy-hat.fbx',
        name: 'Hifi-Wearable',
        dimensions: {
            x: 0.25,
            y: 0.25,
            z: 0.25
        },
        color: {
            red: 0,
            green: 255,
            blue: 0
        },
        position: center,
        // collisionsWillMove: true,
        // ignoreForCollisions: true,
        userData: JSON.stringify({
            "grabbableKey": {
                "invertSolidWhileHeld": false
            },
            "wearable": {
                "joints": ["head", "Head", "hair", "neck"]
            },
            handControllerKey: {
                disableReleaseVelocity: true,
                disableMoveWithHead: true,
            }
        })
    }
    wearable = Entities.addEntity(properties);

}

createWearable();

function cleanup() {
    Entities.deleteEntity(wearable);
}

Script.scriptEnding.connect(cleanup)