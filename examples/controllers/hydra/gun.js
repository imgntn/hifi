/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/
//
//  gun.js
//  examples
//
//  Created by Brad Hefta-Gaub on 12/31/13.
//  Modified by Philip on 3/3/14
//  Modified by Thijs Wenker on 3/31/15
//  Copyright 2013 High Fidelity, Inc.
//
//  This is an example script that turns the hydra controllers and mouse into a entity gun.
//  It reads the controller, watches for trigger pulls, and launches entities.
//  When entities collide with voxels they blow little holes out of the voxels. 
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

HIFI_PUBLIC_BUCKET = "http://s3.amazonaws.com/hifi-public/";

var RED = { red: 255, green: 0, blue: 0 };
var LASER_WIDTH = 2;

var pointer = [];
pointer.push(Overlays.addOverlay("line3d", {
    start: { x: 0, y: 0, z: 0 },
    end: { x: 0, y: 0, z: 0 },
    color: RED,
    alpha: 1,
    visible: true,
    lineWidth: LASER_WIDTH
}));
pointer.push(Overlays.addOverlay("line3d", {
    start: { x: 0, y: 0, z: 0 },
    end: { x: 0, y: 0, z: 0 },
    color: RED,
    alpha: 1,
    visible: true,
    lineWidth: LASER_WIDTH
}));

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

var lastX = 0;
var lastY = 0;
var yawFromMouse = 0;
var pitchFromMouse = 0;
var isMouseDown = false; 

var MIN_THROWER_DELAY = 1000;
var MAX_THROWER_DELAY = 1000;
var LEFT_BUTTON_3 = 3;
var RELOAD_INTERVAL = 5;

var KICKBACK_ANGLE = 15;
var elbowKickAngle = 0.0;
var rotationBeforeKickback; 

var showScore = false;


// Load some sound to use for loading and firing 
var fireSound = SoundCache.getSound(HIFI_PUBLIC_BUCKET + "sounds/Guns/GUN-SHOT2.raw");
var loadSound = SoundCache.getSound(HIFI_PUBLIC_BUCKET + "sounds/Guns/Gun_Reload_Weapon22.raw");
var impactSound = SoundCache.getSound(HIFI_PUBLIC_BUCKET + "sounds/Guns/BulletImpact2.raw");
var targetHitSound = SoundCache.getSound(HIFI_PUBLIC_BUCKET + "sounds/Space%20Invaders/hit.raw");
var targetLaunchSound = SoundCache.getSound(HIFI_PUBLIC_BUCKET + "sounds/Space%20Invaders/shoot.raw");

var gunModel = "https://s3.amazonaws.com/hifi-public/cozza13/gun/m1911-handgun+1.fbx?v=4";

var audioOptions = {
  volume: 0.9
}

var shotsFired = 0;
var shotTime = new Date(); 

var activeControllers = 0; 

// initialize our controller triggers
var triggerPulled = new Array();
var numberOfTriggers = Controller.getNumberOfTriggers();
for (t = 0; t < numberOfTriggers; t++) {
    triggerPulled[t] = false;
}

var isLaunchButtonPressed = false; 
var score = 0; 

var bulletID = false;
var targetID = false;

//  Create overlay buttons and reticle 

var BUTTON_SIZE = 32;
var PADDING = 3;
var NUM_BUTTONS = 3;

var screenSize = Controller.getViewportDimensions();
var startX = screenSize.x / 2 - (NUM_BUTTONS * (BUTTON_SIZE + PADDING)) / 2;
Script.include(["../../libraries/toolBars.js"]);
var toolBar = new ToolBar(0, 0, ToolBar.HORIZONTAL, "highfidelity.gun.toolbar", function (screenSize) {
    return {
        x: startX,
        y: (screenSize.y - (BUTTON_SIZE + PADDING)),
    };
});
var reticle = Overlays.addOverlay("image", {
                    x: screenSize.x / 2 - (BUTTON_SIZE / 2),
                    y: screenSize.y / 2 - (BUTTON_SIZE / 2),
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    imageURL: HIFI_PUBLIC_BUCKET + "images/gun/crosshairs.svg",
                    alpha: 1
                });

var offButton = toolBar.addOverlay("image", {
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    imageURL: HIFI_PUBLIC_BUCKET + "images/gun/close.svg",
                    alpha: 1
                });

startX += BUTTON_SIZE + PADDING;
var platformButton = toolBar.addOverlay("image", {
                    x: startX,
                    y: screenSize.y - (BUTTON_SIZE + PADDING),
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    imageURL: HIFI_PUBLIC_BUCKET + "images/gun/platform-targets.svg",
                    alpha: 1
                });

startX += BUTTON_SIZE + PADDING;
var gridButton = toolBar.addOverlay("image", {
                    x: startX,
                    y: screenSize.y - (BUTTON_SIZE + PADDING),
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    imageURL: HIFI_PUBLIC_BUCKET + "images/gun/floating-targets.svg",
                    alpha: 1
                });

if (showScore) {
    var text = Overlays.addOverlay("text", {
                    x: screenSize.x / 2 - 100,
                    y: screenSize.y / 2 - 50,
                    width: 150,
                    height: 50,
                    color: { red: 0, green: 0, blue: 0},
                    textColor: { red: 255, green: 0, blue: 0},
                    topMargin: 4,
                    leftMargin: 4,
                    text: "Score: " + score
                });
}

var BULLET_VELOCITY = 10.0;

function entityCollisionWithEntity(entity1, entity2, collision) {
    if (entity2 === targetID) {
        score++;
        if (showScore) {
            Overlays.editOverlay(text, { text: "Score: " + score } );
        }

        //  We will delete the bullet and target in 1/2 sec, but for now we can see them bounce!
        Script.setTimeout(deleteBulletAndTarget, 500);

        // Turn the target and the bullet white
        Entities.editEntity(entity1, { color: { red: 255, green: 255, blue: 255 }});
        Entities.editEntity(entity2, { color: { red: 255, green: 255, blue: 255 }});

        // play the sound near the camera so the shooter can hear it
        audioOptions.position = Vec3.sum(Camera.getPosition(), Quat.getFront(Camera.getOrientation()));
        Audio.playSound(targetHitSound, audioOptions);
    }
}

function shootBullet(position, velocity, grenade) {
    var BULLET_SIZE = .09;
    var BULLET_LIFETIME = 10.0;
    var BULLET_GRAVITY = -0.25;
    var GRENADE_VELOCITY = 15.0;
    var GRENADE_SIZE = 0.35;
    var GRENADE_GRAVITY = -9.8;

    var bVelocity = grenade ? Vec3.multiply(GRENADE_VELOCITY, Vec3.normalize(velocity)) : velocity;
    var bSize = grenade ? GRENADE_SIZE : BULLET_SIZE;
    var bGravity = grenade ? GRENADE_GRAVITY : BULLET_GRAVITY; 

    bulletID = Entities.addEntity(
        { type: "Sphere",
          position: position, 
          dimensions: { x: bSize, y: bSize, z: bSize }, 
          color: {  red: 0, green: 0, blue: 0 },  
          velocity: bVelocity, 
          lifetime: BULLET_LIFETIME,
          gravity: {  x: 0, y: bGravity, z: 0 },
          damping: 0.01,
          density: 8000,
          ignoreCollisions: false,
          collisionsWillMove: true
      });
    Script.addEventHandler(bulletID, "collisionWithEntity", entityCollisionWithEntity);

    // Play firing sounds 
    audioOptions.position = position;   
    Audio.playSound(fireSound, audioOptions);
    shotsFired++;
    if ((shotsFired % RELOAD_INTERVAL) == 0) {
        Audio.playSound(loadSound, audioOptions);
    }

    // Kickback the arm 
    if (elbowKickAngle > 0.0) {
        MyAvatar.setJointData("LeftForeArm", rotationBeforeKickback);
    }
    rotationBeforeKickback = MyAvatar.getJointRotation("LeftForeArm"); 
    var armRotation = MyAvatar.getJointRotation("LeftForeArm"); 
    armRotation = Quat.multiply(armRotation, Quat.fromPitchYawRollDegrees(0.0, 0.0, KICKBACK_ANGLE));
    MyAvatar.setJointData("LeftForeArm", armRotation);
    elbowKickAngle = KICKBACK_ANGLE;
}
function shootTarget() {
    var TARGET_SIZE = 0.50;
    var TARGET_GRAVITY = 0.0;
    var TARGET_LIFETIME = 300.0;
    var TARGET_UP_VELOCITY = 0.0;
    var TARGET_FWD_VELOCITY = 0.0;
    var DISTANCE_TO_LAUNCH_FROM = 5.0;
    var ANGLE_RANGE_FOR_LAUNCH = 20.0;
    var camera = Camera.getPosition();
    
    var targetDirection = Quat.angleAxis(getRandomFloat(-ANGLE_RANGE_FOR_LAUNCH, ANGLE_RANGE_FOR_LAUNCH), { x:0, y:1, z:0 });
    targetDirection = Quat.multiply(Camera.getOrientation(), targetDirection);
    var forwardVector = Quat.getFront(targetDirection);
 
    var newPosition = Vec3.sum(camera, Vec3.multiply(forwardVector, DISTANCE_TO_LAUNCH_FROM));

    var velocity = Vec3.multiply(forwardVector, TARGET_FWD_VELOCITY);
    velocity.y += TARGET_UP_VELOCITY;

    targetID = Entities.addEntity(
        { type: "Box",
          position: newPosition, 
          dimensions: { x: TARGET_SIZE * (0.5 + Math.random()), y: TARGET_SIZE * (0.5 + Math.random()), z: TARGET_SIZE * (0.5 + Math.random()) / 4.0 }, 
          color: {  red: Math.random() * 255, green: Math.random() * 255, blue: Math.random() * 255 },  
          velocity: velocity, 
          gravity: {  x: 0, y: TARGET_GRAVITY, z: 0 }, 
          lifetime: TARGET_LIFETIME,
          rotation:  Camera.getOrientation(),
          damping: 0.1,
          density: 100.0, 
          collisionsWillMove: true });

    // Record start time 
    shotTime = new Date();

    // Play target shoot sound
    audioOptions.position = newPosition;   
    Audio.playSound(targetLaunchSound, audioOptions);
}

function makeGrid(type, scale, size) {
    var separation = scale * 2; 
    var pos = Vec3.sum(Camera.getPosition(), Vec3.multiply(10.0 * scale * separation, Quat.getFront(Camera.getOrientation())));
    var x, y, z;
    var GRID_LIFE = 60.0; 
    var dimensions; 

    for (x = 0; x < size; x++) {
        for (y = 0; y < size; y++) {
            for (z = 0; z < size; z++) {
                
                dimensions = { x: separation/2.0 * (0.5 + Math.random()), y: separation/2.0 * (0.5 + Math.random()), z: separation/2.0 * (0.5 + Math.random()) / 4.0 };

                Entities.addEntity(
                    { type: type,
                      position: { x: pos.x + x * separation, y: pos.y + y * separation, z: pos.z + z * separation },
                      dimensions: dimensions, 
                      color: {  red: Math.random() * 255, green: Math.random() * 255, blue: Math.random() * 255 },  
                      velocity: {  x: 0, y: 0, z: 0 }, 
                      gravity: {  x: 0, y: 0, z: 0 }, 
                      lifetime: GRID_LIFE,
                      rotation:  Camera.getOrientation(),
                      damping: 0.1,
                      density: 100.0, 
                      collisionsWillMove: true });
            }
        }
    }
}

function makePlatform(gravity, scale, size) {
    var separation = scale * 2; 
    var pos = Vec3.sum(Camera.getPosition(), Vec3.multiply(10.0 * scale * separation, Quat.getFront(Camera.getOrientation())));
    pos.y -= separation * size;
    var x, y, z;
    var TARGET_LIFE = 60.0; 
    var INITIAL_GAP = 0.5;
    var dimensions; 

    for (x = 0; x < size; x++) {
        for (y = 0; y < size; y++) {
            for (z = 0; z < size; z++) {

                dimensions = { x: separation/2.0, y: separation, z: separation/2.0 };

                Entities.addEntity(
                    { type: "Box",
                      position: { x: pos.x - (separation * size  / 2.0) + x * separation, 
                                  y: pos.y + y * (separation + INITIAL_GAP), 
                                  z: pos.z - (separation * size / 2.0) + z * separation },
                      dimensions: dimensions, 
                      color: {  red: Math.random() * 255, green: Math.random() * 255, blue: Math.random() * 255 },  
                      velocity: {  x: 0, y: 0.05, z: 0 }, 
                      gravity: {  x: 0, y: gravity, z: 0 }, 
                      lifetime: TARGET_LIFE,
                      damping: 0.1,
                      density: 100.0, 
                      collisionsWillMove: true });
            }
        }
    }

    // Make a floor for this stuff to fall onto
    Entities.addEntity({
        type: "Box",
        position: { x: pos.x, y: pos.y - separation / 2.0, z: pos.z }, 
        dimensions: { x: 2.0 * separation * size, y: separation / 2.0, z: 2.0 * separation * size },
        color: { red: 100, green: 100, blue: 100 },
        lifetime: TARGET_LIFE
    });

}

function keyPressEvent(event) {
    // if our tools are off, then don't do anything
    if (event.text == "t") {
        var time = MIN_THROWER_DELAY + Math.random() * MAX_THROWER_DELAY;
        Script.setTimeout(shootTarget, time); 
    } else if ((event.text == ".") || (event.text == "SPACE")) {
        shootFromMouse(false);
    } else if (event.text == ",") {
        shootFromMouse(true);
    } else if (event.text == "r") {
        playLoadSound();
    } else if (event.text == "s") {
        //  Hit this key to dump a posture from hydra to log
        Quat.print("arm = ", MyAvatar.getJointRotation("LeftArm"));
        Quat.print("forearm = ", MyAvatar.getJointRotation("LeftForeArm"));
        Quat.print("hand = ", MyAvatar.getJointRotation("LeftHand"));
    }
}

function playLoadSound() {
    audioOptions.position = Vec3.sum(Camera.getPosition(), Quat.getFront(Camera.getOrientation())); 
    Audio.playSound(loadSound, audioOptions);
    // Raise arm to firing posture 
    takeFiringPose();
}

function clearPose() {
    MyAvatar.clearJointData("LeftForeArm");
    MyAvatar.clearJointData("LeftArm");
    MyAvatar.clearJointData("LeftHand");
}

function deleteBulletAndTarget() {
    Entities.deleteEntity(bulletID);
    Entities.deleteEntity(targetID);
    bulletID = false; 
    targetID = false; 
}

function takeFiringPose() {
    clearPose();
    if (Controller.getNumberOfSpatialControls() == 0) {
        MyAvatar.setJointData("LeftForeArm", {x: -0.251919, y: -0.0415449, z: 0.499487, w: 0.827843});
        MyAvatar.setJointData("LeftArm", { x: 0.470196, y: -0.132559, z: 0.494033, w: 0.719219});
        MyAvatar.setJointData("LeftHand", { x: -0.0104815, y: -0.110551, z: -0.352111, w: 0.929333});
    }
}

MyAvatar.attach(gunModel, "RightHand", {x:0.04, y: 0.22, z: 0.02}, Quat.fromPitchYawRollDegrees(-172, -85, 79), 0.40);
MyAvatar.attach(gunModel, "LeftHand", {x:-0.04, y: 0.22, z: 0.02}, Quat.fromPitchYawRollDegrees(-172, 85, -79), 0.40);

//  Give a bit of time to load before playing sound
Script.setTimeout(playLoadSound, 2000); 

function update(deltaTime) {
    if (activeControllers == 0) {
        if (Controller.getNumberOfSpatialControls() > 0) { 
            activeControllers = Controller.getNumberOfSpatialControls();
            clearPose();
        }
    }

    var KICKBACK_DECAY_RATE = 0.125;
    if (elbowKickAngle > 0.0)  {       
        if (elbowKickAngle > 0.5) {
            var newAngle = elbowKickAngle * KICKBACK_DECAY_RATE;
            elbowKickAngle -= newAngle; 
            var armRotation = MyAvatar.getJointRotation("LeftForeArm");
            armRotation = Quat.multiply(armRotation, Quat.fromPitchYawRollDegrees(0.0, 0.0, -newAngle));
            MyAvatar.setJointData("LeftForeArm", armRotation);
        } else {
            MyAvatar.setJointData("LeftForeArm", rotationBeforeKickback);
            if (Controller.getNumberOfSpatialControls() > 0) {
                clearPose();
            }
            elbowKickAngle = 0.0;
        }
    }


    // check for trigger press

    var numberOfTriggers = 2; 
    var controllersPerTrigger = 2;

    if (numberOfTriggers == 2 && controllersPerTrigger == 2) {
        for (var t = 0; t < 2; t++) {
            var shootABullet = false;
            var triggerValue = Controller.getTriggerValue(t);
            if (triggerPulled[t]) {
                // must release to at least 0.1
                if (triggerValue < 0.1) {
                    triggerPulled[t] = false; // unpulled
                }
            } else {
                // must pull to at least 
                if (triggerValue > 0.5) {
                    triggerPulled[t] = true; // pulled
                    shootABullet = true;
                }
            }
            var palmController = t * controllersPerTrigger; 
            var palmPosition = Controller.getSpatialControlPosition(palmController);
            var fingerTipController = palmController + 1; 
            var fingerTipPosition = Controller.getSpatialControlPosition(fingerTipController);
            var laserTip = Vec3.sum(Vec3.multiply(100.0, Vec3.subtract(fingerTipPosition, palmPosition)), palmPosition);

            //  Update Lasers 
            Overlays.editOverlay(pointer[t], {
                start: palmPosition,
                end: laserTip,
                alpha: 1
            });

            if (shootABullet) {
                 
                var palmToFingerTipVector = 
                        {   x: (fingerTipPosition.x - palmPosition.x),
                            y: (fingerTipPosition.y - palmPosition.y),
                            z: (fingerTipPosition.z - palmPosition.z)  };
                                    
                // just off the front of the finger tip
                var position = { x: fingerTipPosition.x + palmToFingerTipVector.x/2, 
                                 y: fingerTipPosition.y + palmToFingerTipVector.y/2, 
                                 z: fingerTipPosition.z  + palmToFingerTipVector.z/2};   
                   
                var velocity = Vec3.multiply(BULLET_VELOCITY, Vec3.normalize(palmToFingerTipVector)); 

                shootBullet(position, velocity, false);
            }
        }
    }
}

function shootFromMouse(grenade) {
    var DISTANCE_FROM_CAMERA = 1.0;
    var camera = Camera.getPosition();
    var forwardVector = Quat.getFront(Camera.getOrientation());
    var newPosition = Vec3.sum(camera, Vec3.multiply(forwardVector, DISTANCE_FROM_CAMERA));
    var velocity = Vec3.multiply(forwardVector, BULLET_VELOCITY);
    shootBullet(newPosition, velocity, grenade);
}

function mouseReleaseEvent(event) { 
    //  position 
    isMouseDown = false;
}

function mousePressEvent(event) {
    var clickedText = false;
    var clickedOverlay = Overlays.getOverlayAtPoint({x: event.x, y: event.y});
    if (clickedOverlay == offButton) {
        Script.stop();
    } else if (clickedOverlay == platformButton) {
        var platformSize = 3;
        makePlatform(-9.8, 1.0, platformSize);
    } else if (clickedOverlay == gridButton) {
        makeGrid("Box", 1.0, 3);
    } 
}

function scriptEnding() {
    Overlays.deleteOverlay(reticle);
    toolBar.cleanup();
    Overlays.deleteOverlay(pointer[0]);
    Overlays.deleteOverlay(pointer[1]);
    Overlays.deleteOverlay(text);
    MyAvatar.detachOne(gunModel);
    MyAvatar.detachOne(gunModel);
    clearPose();
}

Script.scriptEnding.connect(scriptEnding);
Script.update.connect(update);
Controller.mouseReleaseEvent.connect(mouseReleaseEvent);
Controller.mousePressEvent.connect(mousePressEvent);
Controller.keyPressEvent.connect(keyPressEvent);



