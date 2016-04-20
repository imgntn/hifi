//
//
//  Created by Sam Gateau on 9/9/15.
//  Copyright 2015 High Fidelity, Inc.
//
//  This is a toy script that create a flashlight entity that lit when grabbed
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


var SCRIPT_URL = Script.resolvePath('entity_scripts/flashlight.js');
var MODEL_URL = "http://hifi-production.s3.amazonaws.com/tutorials/flashlight/flashlight.fbx";

var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
  x: 0,
  y: 0.5,
  z: 0
}), Vec3.multiply(0.5, Quat.getFront(Camera.getOrientation())));

var flashlight = Entities.addEntity({
  type: "Model",
  name:'Tutorial Flashlight',
  modelURL: MODEL_URL,
  position: center,
  dimensions: {
    x: 0.08,
    y: 0.30,
    z: 0.08
  },
  dynamic: true,
  shapeType: 'box',
  lifetime: 86400,
  script: SCRIPT_URL,
  userData: JSON.stringify({
    grabbableKey: {
      invertSolidWhileHeld: true
    }
  })
});

Script.stop();