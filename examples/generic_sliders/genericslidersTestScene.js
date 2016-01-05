//
//  genericSlidersTestScene.js
//
//  Created by James Pollack @imgntn on 12/15/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  Given an entity with exposed properties, instantiate some entities that represent various values you can dynamically adjust.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var PARENT_SCRIPT_URL = Script.resolvePath('lightParent.js?' + Math.random(0 - 100));
var basePosition, avatarRot;
avatarRot = Quat.fromPitchYawRollDegrees(0, MyAvatar.bodyYaw, 0.0);
basePosition = Vec3.sum(MyAvatar.position, Vec3.multiply(0, Quat.getUp(avatarRot)));

var testEntity;

function createTestEntity() {
  var testEntityProperties;
  testEntity = Entities.addEntity(testEntityProperties);
}

function cleanup() {
  Entities.deleteEntity(testEntity);
}

Script.scriptEnding.connect(cleanup);

createTestEntity();