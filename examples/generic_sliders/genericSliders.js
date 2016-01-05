//
//  genericSliders.js
//
//  Created by James Pollack @imgntn on 12/15/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  Given a selected entity, instantiate some entities that represent various values you can dynamically adjust by grabbing and moving.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//  

//some experimental options
var ONLY_I_CAN_EDIT = false;
var SLIDERS_SHOULD_STAY_WITH_AVATAR = false;
var VERTICAL_SLIDERS = false;
var SHOW_ENTITY_VOLUME = true;
var USE_PARENTED_PANEL = true;
var VISIBLE_PANEL = true;
var USE_LABELS = true;
var LEFT_LABELS = false;
var RIGHT_LABELS = true;
var ROTATE_CLOSE_BUTTON = false;

//variables for managing overlays
var selectionDisplay;
var selectionManager;

//for when we make a 3d model of a light a parent for the light
var PARENT_SCRIPT_URL = Script.resolvePath('parent.js?' + Math.random(0 - 100));

if (SHOW_ENTITY_VOLUME === true) {

    Script.include('../libraries/gridTool.js');
    Script.include('../libraries/entitySelectionTool.js?' + Math.random(0 - 100));


    var grid = Grid();
    gridTool = GridTool({
        horizontalGrid: grid
    });
    gridTool.setVisible(false);

    selectionDisplay = SelectionDisplay;
    selectionManager = SelectionManager;
    selectionManager.addEventListener(function() {
        selectionDisplay.updateHandles();

    });
}

var DEFAULT_PARENT_ID = '{00000000-0000-0000-0000-000000000000}'

var AXIS_SCALE = 1;

var SLIDER_SCRIPT_URL = Script.resolvePath('slider.js?' + Math.random(0, 100));
var CLOSE_BUTTON_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/light_modifier/red_x.fbx';
var CLOSE_BUTTON_SCRIPT_URL = Script.resolvePath('closeButton.js?' + Math.random(0, 100));
var TRANSPARENT_PANEL_URL = 'http://hifi-content.s3.amazonaws.com/james/light_modifier/transparent_box_alpha_15.fbx';
var VISIBLE_PANEL_SCRIPT_URL = Script.resolvePath('visiblePanel.js?' + Math.random(0, 100));

var RED = {
    red: 255,
    green: 0,
    blue: 0
};

var GREEN = {
    red: 0,
    green: 255,
    blue: 0
};

var BLUE = {
    red: 0,
    green: 0,
    blue: 255
};

var PURPLE = {
    red: 255,
    green: 0,
    blue: 255
};

var WHITE = {
    red: 255,
    green: 255,
    blue: 255
};

var ORANGE = {
    red: 255,
    green: 165,
    blue: 0
}

var SLIDER_DIMENSIONS = {
    x: 0.075,
    y: 0.075,
    z: 0.075
};

var CLOSE_BUTTON_DIMENSIONS = {
    x: 0.1,
    y: 0.025,
    z: 0.1
}

var PER_ROW_OFFSET = {
    x: 0,
    y: -0.2,
    z: 0
};
var sliders = [];
var slidersRef = {};



var basePosition;
var avatarRotation;


function entitySlider(entity, color, propertyToModify, displayText, row) {
    this.entityToModify = entity.id.replace(/[{}]/g, "");
    this.initialProperties = this.entityToModify.initialProperties;
    this.initialDistance;
    this.propertyToModify = propertyToModify;
    this.color = color;
    this.displayText = displayText;
    this.verticalOffset = Vec3.multiply(row, PER_ROW_OFFSET);
    this.avatarRot = Quat.fromPitchYawRollDegrees(0, MyAvatar.bodyYaw, 0.0);
    this.basePosition = Vec3.sum(MyAvatar.position, Vec3.multiply(1.5, Quat.getFront(this.avatarRot)));
    this.basePosition.y += 1;
    basePosition = this.basePosition;
    avatarRot = this.avatarRot;

    var message = {
        entityToModify: this.entityToModify,
        propertyToModify: this.propertyToModify,
        sliderValue: null
    };

    message.sliderValue = this.initialPropertyValue;
    this.setValueFromMessage(message);


    this.setInitialSliderPositions();
    this.createAxis();
    this.createSliderIndicator();
    if (USE_LABELS === true) {
        this.createLabel()
    }
    return this;
}

//what's the ux for adjusting values?  start with simple entities, try image overlays etc
entitySlider.prototype = {
    createAxis: function() {
        //start of line
        var position;
        var extension;

        if (VERTICAL_SLIDERS == true) {
            position = Vec3.sum(this.basePosition, Vec3.multiply(row, (Vec3.multiply(0.2, Quat.getRight(this.avatarRot)))));
            //line starts on bottom and goes up
            var upVector = Quat.getUp(this.avatarRot);
            extension = Vec3.multiply(AXIS_SCALE, upVector);
        } else {
            position = Vec3.sum(this.basePosition, this.verticalOffset);
            //line starts on left and goes to right
            //set the end of the line to the right
            var rightVector = Quat.getRight(this.avatarRot);
            extension = Vec3.multiply(AXIS_SCALE, rightVector);
        }


        this.axisStart = position;
        this.endOfAxis = Vec3.sum(position, extension);
        this.createEndOfAxisEntity();

        var properties = {
            type: 'Line',
            name: 'Hifi-Slider-Axis::' + this.sliderType,
            color: this.color,
            collisionsWillMove: false,
            ignoreForCollisions: true,
            dimensions: {
                x: 3,
                y: 3,
                z: 3
            },
            position: position,
            linePoints: [{
                x: 0,
                y: 0,
                z: 0
            }, extension],
            lineWidth: 5,
        };

        this.axis = Entities.addEntity(properties);
    },
    createEndOfAxisEntity: function() {
        //we use this to track the end of the axis while parented to a panel
        var properties = {
            name: 'Hifi-End-Of-Axis',
            type: 'Box',
            collisionsWillMove: false,
            ignoreForCollisions: true,
            dimensions: {
                x: 0.01,
                y: 0.01,
                z: 0.01
            },
            color: {
                red: 255,
                green: 255,
                blue: 255
            },
            position: this.endOfAxis,
            parentID: this.axis,
            visible: false
        }

        this.endOfAxisEntity = Entities.addEntity(this.endOfAxis);
    },
    createLabel: function() {

        var LABEL_WIDTH = 0.25
        var PER_LETTER_SPACING = 0.1;
        var textWidth = this.displayText.length * PER_LETTER_SPACING;

        var position;
        if (LEFT_LABELS === true) {
            var leftVector = Vec3.multiply(-1, Quat.getRight(this.avatarRot));

            var extension = Vec3.multiply(textWidth, leftVector);

            position = Vec3.sum(this.axisStart, extension);
        }

        if (RIGHT_LABELS === true) {
            var rightVector = Quat.getRight(this.avatarRot);

            var extension = Vec3.multiply(textWidth / 1.75, rightVector);

            position = Vec3.sum(this.endOfAxis, extension);
        }


        var labelProperties = {
            name: 'Hifi-Slider-Label-' + this.sliderType,
            type: 'Text',
            dimensions: {
                x: textWidth,
                y: 0.2,
                z: 0.1
            },
            textColor: {
                red: 255,
                green: 255,
                blue: 255
            },
            text: this.displayText,
            lineHeight: 0.14,
            backgroundColor: {
                red: 0,
                green: 0,
                blue: 0
            },
            position: position,
            rotation: this.avatarRot,
        }
        print('BEFORE CREATE LABEL' + JSON.stringify(labelProperties))
        this.label = Entities.addEntity(labelProperties);
        print('AFTER CREATE LABEL')
    },
    createSliderIndicator: function() {
        var extensionVector;
        var position;
        if (VERTICAL_SLIDERS == true) {
            position = Vec3.sum(this.basePosition, Vec3.multiply(row, (Vec3.multiply(0.2, Quat.getRight(this.avatarRot)))));
            extensionVector = Quat.getUp(this.avatarRot);

        } else {
            position = Vec3.sum(this.basePosition, this.verticalOffset);
            extensionVector = Quat.getRight(this.avatarRot);

        }

        var extension = Vec3.multiply(this.initialDistance, extensionVector);
        var sliderPosition = Vec3.sum(position, extension);



        var properties = {
            type: 'Sphere',
            name: 'Hifi-Slider-' + this.sliderType,
            dimensions: SLIDER_DIMENSIONS,
            collisionsWillMove: true,
            color: this.color,
            position: sliderPosition,
            script: SLIDER_SCRIPT_URL,
            ignoreForCollisions: true,
            userData: JSON.stringify({
                genericSliderKey: {
                    entityToModify: this.entityToModify,
                    propertyToModify: this.propertyToModify
                    axisStart: position,
                    axisEnd: this.endOfAxis,
                },
                handControllerKey: {
                    disableReleaseVelocity: true,
                    disableMoveWithHead: true,
                    disableNearGrab: true
                }
            }),
        };

        this.sliderIndicator = Entities.addEntity(properties);
    },
    setValueFromMessage: function(message) {

        //message is not for us
        if (message.entityToModify !== this.entityToModify) {
            //    print('not ours')
            return;
        }

        //message is not our type
        if (message.propertyToModify !== this.propertyToModify) {
            //    print('not our property type')
            return
        }

        var properties = Entities.getEntityProperties(this.entityToModify);

        if (this.sliderType === message.propertyToModify) {

            //send a message with the new slider value to the entity to modify.  which will have to listen and do its thing internally

            var data = {
                sliderValue: message.sliderValue,
                propertyToModify: this.propertyToModify,
                entityToModify:this.entityToModify
            };

            //with lights this is where actual edits happened, but this will bounce back to the entity with a message now
            console.log('DATA TO SEND TO ENTITY:::'+JSON.stringify(data))
            Messages.sendMessage('Hifi-Exposed-Properties', JSON.stringify(data));

        }

    },
    setInitialSliderPositions: function(initialProperty, maximum) {
        this.initialSliderPosition = (initialProperty / maximum) * AXIS_SCALE;
    }

};


var panel;
var visiblePanel;

function makeSliders(entityID) {

    if (USE_PARENTED_PANEL === true) {
        panel = createPanelEntity(MyAvatar.position);
    }

    //get exposed properties
    //for each create a new slider
    var properties = Entities.getEntityProperties(entityID, "userData");
    var userData = JSON.parse(properties.userData);
    var exposedProperties = userData.exposedProperties;

    exposedProperties.forEach(function(ep, index) {
        var slider = new entitySlider(entityID, WHITE, ep.name, ep.displayName, index);
        slidersRef[ep.name] = slider;
        sliders.push(slider);
    })

    createCloseButton(sliders[0].axisStart);

    subscribeToSliderMessages();

    if (USE_PARENTED_PANEL === true) {
        parentEntitiesToPanel(panel);
    }

    if (SLIDERS_SHOULD_STAY_WITH_AVATAR === true) {
        parentPanelToAvatar(panel);
    }

    if (VISIBLE_PANEL === true) {
        visiblePanel = createVisiblePanel();
    }
};

function parentPanelToAvatar(panel) {
    //this is going to need some more work re: the sliders actually being grabbable.  probably something to do with updating axis movement
    Entities.editEntity(panel, {
        parentID: MyAvatar.sessionUUID,
        //actually figure out which one to parent it to -- probably a spine or something.
        parentJointIndex: 1,
    })
}


function parentEntitiesToPanel(panel) {

    sliders.forEach(function(slider) {
        Entities.editEntity(slider.axis, {
            parentID: panel
        })
        Entities.editEntity(slider.sliderIndicator, {
            parentID: panel
        })
    })

    closeButtons.forEach(function(button) {
        Entities.editEntity(button, {
            parentID: panel
        })
    })
}

function createPanelEntity(position) {
    print('CREATING PANEL at ' + JSON.stringify(position));
    var panelProperties = {
        name: 'Hifi-Slider-Panel',
        type: 'Box',
        dimensions: {
            x: 0.1,
            y: 0.1,
            z: 0.1
        },
        visible: false,
        collisionsWillMove: false,
        ignoreForCollisions: true
    }

    var panel = Entities.addEntity(panelProperties);
    return panel
}

function createVisiblePanel() {
    var totalOffset = -PER_ROW_OFFSET.y * sliders.length;

    var moveRight = Vec3.sum(basePosition, Vec3.multiply(AXIS_SCALE / 2, Quat.getRight(avatarRot)));

    var moveDown = Vec3.sum(moveRight, Vec3.multiply((sliders.length + 1) / 2, PER_ROW_OFFSET))
    var panelProperties = {
        name: 'Hifi-Visible-Transparent-Panel',
        type: 'Model',
        modelURL: TRANSPARENT_PANEL_URL,
        dimensions: {
            x: AXIS_SCALE + 0.1,
            y: totalOffset,
            z: SLIDER_DIMENSIONS.z / 4
        },
        visible: true,
        collisionsWillMove: false,
        ignoreForCollisions: true,
        position: moveDown,
        rotation: avatarRot,
        script: VISIBLE_PANEL_SCRIPT_URL
    }

    var panel = Entities.addEntity(panelProperties);

    return panel
}

var closeButtons = [];

function createCloseButton(axisStart) {
    var MARGIN = 0.10;
    var VERTICAL_OFFFSET = {
        x: 0,
        y: 0.15,
        z: 0
    };
    var leftVector = Vec3.multiply(-1, Quat.getRight(avatarRot));
    var extension = Vec3.multiply(MARGIN, leftVector);
    var position = Vec3.sum(axisStart, extension);

    var buttonProperties = {
        name: 'Hifi-Close-Button',
        type: 'Model',
        modelURL: CLOSE_BUTTON_MODEL_URL,
        dimensions: CLOSE_BUTTON_DIMENSIONS,
        position: Vec3.sum(position, VERTICAL_OFFFSET),
        rotation: Quat.multiply(avatarRot, Quat.fromPitchYawRollDegrees(90, 0, 45)),
        collisionsWillMove: false,
        ignoreForCollisions: true,
        script: CLOSE_BUTTON_SCRIPT_URL,
        userData: JSON.stringify({
            grabbableKey: {
                wantsTrigger: true
            }
        })
    }

    var button = Entities.addEntity(buttonProperties);

    closeButtons.push(button);

    if (ROTATE_CLOSE_BUTTON === true) {
        Script.update.connect(rotateCloseButtons);
    }
}

function rotateCloseButtons() {
    closeButtons.forEach(function(button) {
        Entities.editEntity(button, {
            angularVelocity: {
                x: 0,
                y: 0.5,
                z: 0
            }
        })

    })
}

// function subScribeToNewLights() {
//     Messages.subscribe('Hifi-Light-Mod-Receiver');
//     Messages.messageReceived.connect(handleLightModMessages);
// }

function subscribeToSliderMessages() {
    Messages.subscribe('Hifi-Slider-Value-Reciever');
    Messages.messageReceived.connect(handleValueMessages);
}



function subscribeToCleanupMessages() {
    Messages.subscribe('Hifi-Generic-Modifier-Cleanup');
    Messages.messageReceived.connect(handleCleanupMessages);
}


// function handleLightModMessages(channel, message, sender) {
//     if (channel !== 'Hifi-Generic-Mod-Receiver') {
//         return;
//     }
//     if (sender !== MyAvatar.sessionUUID) {
//         return;
//     }
//     var parsedMessage = JSON.parse(message);

//     makeSliders(entityToModify);

//     if (SHOW_ENTITY_VOLUME === true) {
//         selectionManager.setSelections([parsedMessage.light.id]);
//     }
// }

function handleValueMessages(channel, message, sender) {

    if (channel !== 'Hifi-Slider-Value-Reciever') {
        return;
    }
    if (ONLY_I_CAN_EDIT === true && sender !== MyAvatar.sessionUUID) {
        return;
    }
    var parsedMessage = JSON.parse(message);

    slidersRef[message.propertyToModify].setValueFromMessage(parsedMessage);
}


var block;
var oldParent = null;
var hasParent = false;

function handleCreateSlidersMessages(channel, message, sender) {

    if (channel !== 'Hifi-Generic-Sliders-Setup') {
        return;
    }

    var entityID = message.entityID;

    makeSliders(entityID);

    if (SHOW_ENTITY_VOLUME === true) {
        selectionManager.setSelections([entityID]);
    }

}
}

function handleCleanupMessages(channel, message, sender) {

    if (channel !== 'Hifi-Generic-Modifier-Cleanup') {
        return;
    }
    if (ONLY_I_CAN_EDIT === true && sender !== MyAvatar.sessionUUID) {
        return;
    }
    if (message === 'callCleanup') {
        cleanup(true);
    }
}

function updateSliderAxis() {
    sliders.forEach(function(slider) {

    })
}

function cleanup(fromMessage) {
    var i;
    for (i = 0; i < sliders.length; i++) {
        Entities.deleteEntity(sliders[i].axis);
        Entities.deleteEntity(sliders[i].sliderIndicator);
        Entities.deleteEntity(sliders[i].label);
    }

    while (closeButtons.length > 0) {
        Entities.deleteEntity(closeButtons.pop());
    }

    //if the light was already parented to something we will want to restore that.  or come up with groups or something clever.
    // if (oldParent !== null) {
    //     Entities.editEntity(currentLight, {
    //         parentID: oldParent,
    //     });
    // } else {
    //     Entities.editEntity(currentLight, {
    //         parentID: null,
    //     });
    // }


    if (fromMessage !== true) {
        // Messages.messageReceived.disconnect(handleLightModMessages);
        Messages.messageReceived.disconnect(handleValueMessages);
    }


    Entities.deleteEntity(panel);
    Entities.deleteEntity(visiblePanel);

    selectionManager.clearSelections();

    if (ROTATE_CLOSE_BUTTON === true) {
        Script.update.disconnect(rotateCloseButtons);
    }

    if (hasParent === false) {
        Entities.deleteEntity(block);
    }

    oldParent = null;
    hasParent = false;
    sliders = [];

}

Script.scriptEnding.connect(cleanup);


// subScribeToNewLights();
subscribeToCleanupMessages();



//other light properties
// diffuseColor: { red: 255, green: 255, blue: 255 },
// ambientColor: { red: 255, green: 255, blue: 255 },
// specularColor: { red: 255, green: 255, blue: 255 },
// constantAttenuation: 1,
// linearAttenuation: 0,
// quadraticAttenuation: 0,
// exponent: 0,
// cutoff: 180, // in degrees