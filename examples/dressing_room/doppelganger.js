//
//  doppelganger.js
//
//  Created by James B. Pollack @imgntn on 12/28/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  This script shows how to hook up a model entity to your avatar to act as a doppelganger.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
//  To-Do:  mirror joints, rotate avatar fully, automatically get avatar fbx, make sure dimensions for avatar are right when u bring it in

var TEST_MODEL_URL = 'https://s3.amazonaws.com/hifi-public/ozan/avatars/albert/albert/albert.fbx';
var MIRRORED_ENTITY_SCRIPT_URL = Script.resolvePath('mirroredEntity.js');
var FREEZE_TOGGLER_SCRIPT_URL = Script.resolvePath('freezeToggler.js?' + Math.random(0, 1000))
var USE_DEBOUNCE = false;
var DEBOUNCE_RATE = 100;
var doppelgangers = [];

function Doppelganger(avatar) {
    this.initialProperties = {
        name: 'Hifi-Doppelganger',
        type: 'Model',
        modelURL: TEST_MODEL_URL,
        position: putDoppelgangerAcrossFromAvatar(this, avatar),
        rotation: rotateDoppelgangerTowardAvatar(this, avatar),
        collisionsWillMove: false,
        ignoreForCollisions: false,
        script: FREEZE_TOGGLER_SCRIPT_URL,
        userData: JSON.stringify({
            grabbableKey: {
                grabbable: false,
                wantsTrigger: true
            }
        })
    };

    this.id = createDoppelgangerEntity(this);
    var _t = this;
    var props = Entities.getEntityProperties(this);
    //hack to make the model clickable / pickable again
    Script.setTimeout(function() {
        console.log('MOOV')
        Entities.editEntity(_this.id, {
            position: {
                x: props.position.x + 0.01,
                y: props.position.y,
                z: props.position.z
            }
        })
    }, 1500)
    this.avatar = avatar;
    return this;
}

function getJointData(avatar) {
    var allJointData = [];
    var jointNames = MyAvatar.jointNames;
    jointNames.forEach(function(joint, index) {
        var translation = MyAvatar.getJointTranslation(index);
        var rotation = MyAvatar.getJointRotation(index)
        allJointData.push({
            joint: joint,
            index: index,
            translation: translation,
            rotation: rotation
        })
    });

    return allJointData;
}

function setJointData(doppelganger, allJointData) {
    var jointRotations = [];
    allJointData.forEach(function(jointData, index) {
        jointRotations.push(jointData.rotation);
    });
    Entities.setAbsoluteJointRotationsInObjectFrame(doppelganger.id, jointRotations);

    return true;
}

function mirrorJointData() {
    return mirroredJointData;
}

function createDoppelganger(avatar) {
    return new Doppelganger(avatar);
}

function createDoppelgangerEntity(doppelganger) {
    return Entities.addEntity(doppelganger.initialProperties);
}

function putDoppelgangerAcrossFromAvatar(doppelganger, avatar) {
    var avatarRot = Quat.fromPitchYawRollDegrees(0, avatar.bodyYaw, 0.0);
    var position;

    var ids = Entities.findEntities(MyAvatar.position, 20);
    var hasBase = false;
    for (var i = 0; i < ids.length; i++) {
        var entityID = ids[i];
        var props = Entities.getEntityProperties(entityID, "name");
        var name = props.name;
        if (name === "Hifi-Dressing-Room-Base") {
            var details = Entities.getEntityProperties(entityID, ["position", "dimensions"]);
            details.position.y += getAvatarFootOffset();
            details.position.y += details.dimensions.y / 2;
            position = details.position;
            hasBase = true;
        }
    }

    if (hasBase === false) {
        position = Vec3.sum(avatar.position, Vec3.multiply(1.5, Quat.getFront(avatarRot)));

    }

    return position;
}

function getAvatarFootOffset() {
    var data = getJointData();
    var upperLeg, lowerLeg, foot, toe, toeTop;
    data.forEach(function(d) {

        var jointName = d.joint;
        if (jointName === "RightUpLeg") {
            upperLeg = d.translation.y;
        }
        if (jointName === "RightLeg") {
            lowerLeg = d.translation.y;
        }
        if (jointName === "RightFoot") {
            foot = d.translation.y;
        }
        if (jointName === "RightToeBase") {
            toe = d.translation.y;
        }
        if (jointName === "RightToe_End") {
            toeTop = d.translation.y
        }
    })

    var myPosition = MyAvatar.position;
    var offset = upperLeg + lowerLeg + foot + toe + toeTop;
    offset = offset / 100;
    return offset
}

function rotateDoppelgangerTowardAvatar(doppelganger, avatar) {
    var avatarRot = Quat.fromPitchYawRollDegrees(0, avatar.bodyYaw, 0.0);

    var ids = Entities.findEntities(MyAvatar.position, 20);
    var hasBase = false;
    for (var i = 0; i < ids.length; i++) {
        var entityID = ids[i];
        var props = Entities.getEntityProperties(entityID, "name");
        var name = props.name;
        if (name === "Hifi-Dressing-Room-Base") {
            var details = Entities.getEntityProperties(entityID, "rotation");
            avatarRot = details.rotation;
        }
    }
    if (hasBase === false) {
        avatarRot = Vec3.multiply(-1, avatarRot);
    }
    return avatarRot;
}

var isConnected = false;

function connectDoppelgangerUpdates() {
    Script.update.connect(updateDoppelganger);
    isConnected = true;
}

function disconnectDoppelgangerUpdates() {
    print('SHOULD DISCONNECT')
    if (isConnected === true) {
        Script.update.disconnect(updateDoppelganger);
    }
    isConnected = false;
}

var sinceLastUpdate = 0;

function updateDoppelganger(deltaTime) {
    if (USE_DEBOUNCE === true) {
        sinceLastUpdate = sinceLastUpdate + deltaTime * 100;
        if (sinceLastUpdate > DEBOUNCE_RATE) {
            sinceLastUpdate = 0;
        } else {
            return;
        }
    }

    doppelgangers.forEach(function(doppelganger) {
        var joints = getJointData(MyAvatar);
        //var mirroredJoints = mirrorJointData(joints);
        setJointData(doppelganger, joints);
    });
}

function subscribeToWearableMessages() {
    Messages.subscribe('Hifi-Doppelganger-Wearable');
    Messages.messageReceived.connect(handleWearableMessages);
}

function subscribeToFreezeMessages() {
    Messages.subscribe('Hifi-Doppelganger-Freeze');
    Messages.messageReceived.connect(handleFreezeMessages);
}

function handleFreezeMessages(channel, message, sender) {
    if (channel !== 'Hifi-Doppelganger-Freeze') {
        return;
    }
    if (sender !== MyAvatar.sessionUUID) {
        return;
    }

    var parsedMessage = null;

    try {
        parsedMessage = JSON.parse(message);
    } catch (e) {
        print('error parsing wearable message');
    }
    print('MESSAGE ACTION::' + parsedMessage.action)
    if (parsedMessage.action === 'freeze') {
        print('ACTUAL FREEZE')
        disconnectDoppelgangerUpdates();
    }
    if (parsedMessage.action === 'unfreeze') {
        print('ACTUAL UNFREEZE')

        connectDoppelgangerUpdates();
    }

}

var wearablePairs = [];

function handleWearableMessages(channel, message, sender) {
    if (channel !== 'Hifi-Doppelganger-Wearable') {
        return;
    }
    if (sender !== MyAvatar.sessionUUID) {
        return;
    }

    var parsedMessage = null;

    try {
        parsedMessage = JSON.parse(message);
    } catch (e) {
        print('error parsing wearable message');
    }
    print('parsed message!!!')

    mirrorEntitiesForDoppelganger(doppelgangers[0], parsedMessage);

}

function mirrorEntitiesForAvatar(){

}

function mirrorEntitiesForDoppelganger(doppelganger, parsedMessage) {
    var doppelgangerProps = Entities.getEntityProperties(doppelganger.id);

    var action = parsedMessage.action;
    print('IN MIRROR ENTITIES CALL' + action)

    var baseEntity = parsedMessage.baseEntity;

    var wearableProps = Entities.getEntityProperties(baseEntity);

    delete wearableProps.id;
    delete wearableProps.created;
    delete wearableProps.age;
    delete wearableProps.ageAsText;
    delete wearableProps.position;
    // add to dg
    // add to avatar
    // moved item on dg
    // moved item on avatar
    // remove item from dg
    // remove item from avatar
 
    var joint = wearableProps.parentJointIndex;
    if (action === 'add') {
        print('IN DOPPELGANGER ADD')
            //the position of the mirror entity will be the doppelganger position plus the offset of the wearable on the base entity.
            //var newPosition = Vec3.sum(doppelgangerProps.position, parsedMessage.centerToWearable);

        var jointPosition = Entities.getAbsoluteJointTranslationInObjectFrame(doppelganger.id, joint);
        var jointRotation = Entities.getAbsoluteJointRotationInObjectFrame(doppelganger.id, joint);

        wearableProps.parentID = doppelganger.id;
        wearableProps.parentJointIndex = joint;
        wearableProps.localPosition = Vec3.subtract(wearableProps.localPosition, jointPosition);
        // wearableProps.localRotation = Quat.multiply(wearableProps.localRotation, jointRotation);
        //create a new one
        wearableProps.script = MIRRORED_ENTITY_SCRIPT_URL;
        wearableProps.name = 'Hifi-Doppelganger-Mirrored-Entity';
        wearableProps.userData = JSON.stringify({
            doppelgangerKey: {
                baseEntity: baseEntity,
                doppelganger: doppelganger.id
            }
        })
        var mirrorEntity = Entities.addEntity(wearableProps);

        print('MIRROR ENTITY CREATED:::' + mirrorEntity)
        var mirrorEntityProps = Entities.getEntityProperties(mirrorEntity)
        print('MIRROR PROPS::' + JSON.stringify(mirrorEntityProps))
        var wearablePair = {
            baseEntity: baseEntity,
            mirrorEntity: mirrorEntity
        }

        wearablePairs.push(wearablePair);
    }

    if (action === 'update') {
        // var newPosition = Vec3.sum(doppelgangerProps.position, parsedMessage.centerToWearable);
        // wearableProps.position = newPosition;
 
        var jointPosition = Entities.getAbsoluteJointTranslationInObjectFrame(doppelganger.id, joint);
        var jointRotation = Entities.getAbsoluteJointRotationInObjectFrame(doppelganger.id, joint);

        wearableProps.parentID = doppelganger.id;
        wearableProps.localPosition = Vec3.subtract(wearableProps.localPosition, jointPosition);

        var mirrorEntity = getMirrorEntityForBaseEntity(baseEntity);
     //   print('MIRROR ENTITY, newPosition' + mirrorEntity + ":::" + JSON.stringify(newPosition))
        Entities.editEntity(mirrorEntity, wearableProps)
    }

    if (action === 'remove') {
        Entities.deleteEntity(getMirrorEntityForBaseEntity(baseEntity))
        wearablePairs = wearablePairs.filter(function(obj) {
            return obj.baseEntity !== baseEntity;
        });
    }

    if (action === 'updateBase') {
        //this gets called when the mirrored entity gets grabbed.  now we move the 
        var mirrorEntityProperties = Entities.getEntityProperties(message.mirrorEntity)
        var doppelgangerToMirrorEntity = Vec3.subtract(doppelgangerProps.position, mirrorEntityProperties.position);
        var newPosition = Vec3.sum(MyAvatar.position, doppelgangerToMirrorEntity);

        delete mirrorEntityProperties.id;
        delete mirrorEntityProperties.created;
        delete mirrorEntityProperties.age;
        delete mirrorEntityProperties.ageAsText;
        mirrorEntityProperties.position = newPosition;
        mirrorEntityProperties.parentID = MyAvatar.sessionUUID;
        Entities.editEntity(message.baseEntity, mirrorEntityProperties);
    }
}

function getMirrorEntityForBaseEntity(baseEntity) {
    var result = wearablePairs.filter(function(obj) {
        return obj.baseEntity === baseEntity;
    });
    if (result.length === 0) {
        return false;
    } else {
        return result[0].mirrorEntity
    }
}

function makeDoppelgangerForMyAvatar() {
    var doppelganger = createDoppelganger(MyAvatar);
    doppelgangers.push(doppelganger);
    connectDoppelgangerUpdates();
}



makeDoppelgangerForMyAvatar();
subscribeToWearableMessages();
subscribeToFreezeMessages();

function cleanup() {
    if (isConnected === true) {
        disconnectDoppelgangerUpdates();
    }

    doppelgangers.forEach(function(doppelganger) {
        print('DOPPELGANGER' + doppelganger.id)
        Entities.deleteEntity(doppelganger.id);
    });
}

Script.scriptEnding.connect(cleanup);