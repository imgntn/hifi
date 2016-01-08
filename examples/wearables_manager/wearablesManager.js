//
//  wearablesManager.js
//
//  Created by James B. Pollack @imgntn on 1/7/2016
//  Copyright 2016 High Fidelity, Inc.
//
//  This script handles messages from the grab script related to wearables, and interacts with a doppelganger.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

Script.include("../libraries/utils.js");

var NULL_UUID = "{00000000-0000-0000-0000-000000000000}";
var DEFAULT_WEARABLE_DATA = {
    joints: []
};

function WearablesManager() {

    this.wearables = [];

    this.subscribeToMessages = function() {
        Messages.subscribe('Hifi-Wearables-Manager');
        Messages.messageReceived.connect(this.handleWearableMessages);
        print("WearableManager setup done");
    }

    this.handleWearableMessages = function(channel, message, sender) {
        print('wearablesManager messageReceived ::: ' + channel + " ::: " + message)
        if (channel !== 'Hifi-Wearables-Manager') {
            return;
        }
        if (sender !== MyAvatar.sessionUUID) {
            print('wearablesManager got message from wrong sender');
            return;
        }

        var parsedMessage = null;

        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            print('error parsing wearable message');
        }
        
        if(parsedMessage.action==='update'){
           manager.updateWearable(message.grabbedEntity)
        } else if(parsedMessage.action==='checkIfWearable'){
            manager.checkIfWearable(message.grabbedEntity)
        } else {
            print('unknown actions: ' + message.action);
        }
        print('parsed message!!!')
    }

    this.updateWearable = function(grabbedEntity) {
        if (this.wearables.length > 0) {

            //only do this check if we already have some wearables for the doppelganger
            var hasWearableAlready = this.wearables.indexOf(grabbedEntity);
            var props = Entities.getEntityProperties(grabbedEntity, "position");
            var centerToWearable = Vec3.subtract(MyAvatar.position, props.position);

            if (hasWearableAlready > -1) {
                var data = {
                    action: 'update',
                    baseEntity: grabbedEntity,
                    centerToWearable: centerToWearable
                }
                Messages.sendMessage('Hifi-Doppelganger-Wearable', JSON.stringify(data))
            }
        }
    }

    this.checkIfWearable = function(grabbedEntity) {
        print('checking if wearable')

        var allowedJoints = getEntityCustomData('wearable', grabbedEntity, DEFAULT_WEARABLE_DATA).joints;

        var props = Entities.getEntityProperties(grabbedEntity, ["position", "parentID"]);
        if (props.parentID === NULL_UUID || props.parentID === MyAvatar.sessionUUID) {
            var bestJointName = "";
            var bestJointIndex = -1;
            var bestJointDistance = 0;
            print("here:" + grabbedEntity);
            allowedJoints.forEach(function(jointName) {
                var jointIndex = MyAvatar.getJointIndex(jointName);
                var jointPosition = MyAvatar.getJointPosition(jointIndex);
                print("---");
                print(jointName + " position = " + vec3toStr(jointPosition));
                // print("item position = " + vec3toStr(props.position));
                var distanceFromJoint = Vec3.distance(jointPosition, props.position);
                var jointToWearable = Vec3.subtract(jointPosition, props.position);
                // print("distance from joint = " + distanceFromJoint);
                if (distanceFromJoint < 0.4) {
                    if (bestJointIndex == -1 || distanceFromJoint < bestJointDistance) {
                        bestJointName = jointName;
                        bestJointIndex = jointIndex;
                        bestJointDistance = distanceFromJoint;
                    }
                }
            });

            var centerToWearable = Vec3.subtract(MyAvatar.position, props.position);

            if (bestJointIndex != -1) {
                print("best joint is " + bestJointName + " at " + bestJointDistance);
                Entities.editEntity(grabbedEntity, {
                    parentID: MyAvatar.sessionUUID,
                    parentJointIndex: bestJointIndex
                });
                if (this.wearables.indexOf(this.grabbedEntity) < 0) {
                    print('adding, should send message....')
                    var data = {
                        action: 'add',
                        baseEntity: grabbedEntity,
                        centerToWearable: centerToWearable,
                    }
                    Messages.sendMessage('Hifi-Doppelganger-Wearable', JSON.stringify(data));
                    this.wearables.push(grabbedEntity)
                }

            } else {
                Entities.editEntity(grabbedEntity, {
                    parentID: NULL_UUID
                });

                var hasWearableAlready = this.wearables.indexOf(grabbedEntity);
                if (hasWearableAlready > -1) {
                    var data = {
                        action: 'remove',
                        baseEntity: this.grabbedEntity
                    }

                    Messages.sendMessage('Hifi-Doppelganger-Wearable', JSON.stringify(data));
                }

                this.wearables.splice(hasWearableAlready, 1)
            }
        } else {
            print("entity is already a child");
        }
    }
}

var manager = new WearablesManager();
manager.subscribeToMessages();
