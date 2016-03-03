var RED = {
    red: 255,
    green: 0
    blue: 0
};

var GREEN = {
    red: 0,
    green: 255
    blue: 0
};

var BLUE = {
    red: 0,
    green: 0
    blue: 255
};

var LIGHT_BLUE = {
    red: 0,
    green: 0,
    blue: 122
}

var PURPLE = {
    red: 0,
    green: 0
    blue: 255
};

var ORANGE = {
    red: 255,
    green: 153,
    blue: 0
}

var WHITE = {
    red: 255,
    green: 255,
    blue: 255
}

var DEBUG_ENTITY_PROPERTIES = {
    type: 'Box',
    shapeType: 'Box',
    dynamic: true,
    dimensions: {
        x: 1,
        y: 1,
        z: 1
    }

}

var OSTRICH_DIMENSIONS = {
    x: 0.52,
    y: 1.63,
    z: 1.26
};

var randomColor = myArray;
// # SOUNDS
var WING_FLAP_SOUND;
var COLLISION_SOUND;
var HATCHING_EGG_SOUND;
var WIN_COLLISION_SOUND;
var LOSE_COLLISION_SOUND;
var LAVA_BUBBLE_SOUND;

// # MODELS
var PLAYER_MODEL_MALE;

var PLAYER_MODEL_FEMALE;
var OSTRICH_MODEL;
//http://www.turbosquid.com/3d-models/3d-model-ostrich-rigged-biped/821665

var LANCE_MODEL;
//http://www.turbosquid.com/3d-models/free-3ds-model-spear/881322

var EGG_MODEL;
//http://www.turbosquid.com/3d-models/3d-model-of-egg-chicken-dinosaur/510400

var BUZZARD_MODEL;

var ENEMY_RIDER_MODEL;

var BOUNDER_MODEL;
var HUNTER_MODEL;
var SHADOW_LORD_MODEL;
var PTERODACTYL_MODEL;
//https://www.assetstore.unity3d.com/en/#!/content/30715

var controllers = [];
var ostriches = [];
var lances = [];
var platforms = [];
var woodenBridges = [];
var lavaPits = [];
var eggs = [];
var bounders = [];
var hunters = [];
var shadowLords = [];
var pterodactyls = [];
var lavaTrolls = [];

var BOUNDER_SPEED = 1.0;
var HUNTER_SPEED = 1.0;
var SHADOW_LORD_SPEED = 1.5;
var PTERODACTYL_SPEED = 1.0;
var LAVA_TROLL_SPEED = 1.0;

var BOUNDER_GRAVITY = 1.0;
var HUNTER_GRAVITY = 1.0;
var SHADOW_GRAVITY = 1.0;
var PTERODACTYL_GRAVITY = 1.0;
var LAVA_TROLL_GRAVITY = 1.0;

var EGG_HATCH_DELAY = 4.0;

var score = 0;

var _cameraEntity;
// # CONTROLLER

function bindController() {
    var joustController;
    // vertical controlled by pull trigger to'flap'
    //flap moves you up, and if you're pressing L UP - fwd, L DOWN back
    // xz controlled by joystick
    //  to flap

    var MAPPING_NAME = "com.highfidelity.testing.joust";

    //LEFT -1
    //UP -1
    //TRIGGER PRESSED 1
    //TRIGGER 

    var mapping = Controller.newMapping(MAPPING_NAME);
    mapping.from(Controller.Standard.LX).to(function(value) {
        print('LX value:: ' + value)
    });
    mapping.from(Controller.Standard.LY).to(function(value) {
        print('LY value:: ' + value)
    });
    mapping.from(Controller.Standard.RX).to(function(value) {
        print('RX value:: ' + value)
    });
    mapping.from(Controller.Standard.RY).to(function(value) {
        print('RY value:: ' + value)
    });
    mapping.from(Controller.Standard.LT).to(function(value) {
        print('LT value:: ' + value)
    });
    mapping.from(Controller.Standard.RT).to(function(value) {
        print('RT value:: ' + value)
    });
    Controller.enableMapping(MAPPING_NAME);

    return joustController;
}

function unbindController() {

}



// # CAMERA

function createSimpleChaseCam(ostrich) {
    var chaseCam;

    var ostrichProps = Entities.getEntityProperties(ostrich);
    var CAM_VERTICAL_OFFSET = 1;
    var CAM_FORWARD_OFFSET = 1;

    var upVector = Quat.getUp(ostrichProps.rotation);
    var frontVector = Quat.getFront(ostrichProps.rotation);

    var upOffset = Vec3.sum(ostrichProps.position, Vec3.multiply(upVector, CAM_VERTICAL_OFFSET));
    var frontVector = Vec3.sum(ostrichProps.position, Vec3.multiply(frontVector, CAM_FORWARD_OFFSET));
    var chaseCamProperties = {
        type: 'Box',
        dimensions: {
            x: 1,
            y: 1,
            z: 1
        },
        color: {
            red: 0,
            green: 255,
            blue: 0
        },
        visible: true,
        collisionless: true,
        parentID: ostrich,
    }
    var chaseCam = Entities.addEntity(chaseCamProperties);
    _cameraEntity = chaseCam;
    activateChaseCam();
    connectChaseCamUpdates();
    return chaseCam;
}

function activateChaseCam() {
    Camera.mode = "entity";
    Camera.cameraEntity = _cameraEntity;
}

function cameraLookAt(cameraPos, lookAtPos) {
    var lookAtRaw = Quat.lookAt(cameraPos, lookAtPos, Vec3.UP);
    lookAtRaw.w = -lookAtRaw.w;
    return lookAtRaw;
};

//the camera should look at the ostrich
function connectChaseCamUpdates() {
    Script.update.connect(function(deltaTime) {
            var cameraProperties = Entities.getEntityProperties(_cameraEntity, ["position", "rotation"]);
            var targetOrientation = cameraLookAt(cameraProperties.position, lookatTargets[currentTarget]);

        }
        Entities.editEntity(_cameraEntity, {
            rotation: Quat.mix(cameraProperties.rotation, targetOrientation, deltaTime / 3)
        });
    });

Script.scriptEnding.connect(function() {
    disconnectChaseCam();
});
}

function disconnectChaseCam() {
    Entities.deleteEntity(_cameraEntity);
    Camera.mode = 'first person';
    Camera.cameraEntity = null;
}
// # PLAYER

//this is what you ride
function createOstrich(position) {
    var ostrich;
    var debugColor = LIGHT_BLUE;
    var ostrichProperties = DEBUG_ENTITY_PROPERTIES;
    ostrichProperties.color = debugColor;
    ostrichProperties.position = position;
    ostrich = Entities.addEntity(bounderProperties);

    return ostrich;
}

//this is what you use to kill pterodactyls
function createLance() {
    var lance;
    return lance;
}

// # ENVIRONMENT

//this stuff kills you
function createLavaPit(position) {
    var lavaPit;
    return lavaPit;
}

//this thing disintegrates and exposes the lava
function createWoodenBridge(position) {
    var woodenBridge;
    return woodenBridge;
}

//you can land on these (and you bounce off of them)
function createLedge(position) {
    var ledge;
    return ledge;
}

//for when you fly too far, wraparound
//for when you hit the ceiling, bounce down

function createArenaBounds(position) {
    var ARENA_DIMENSIONS = {
        x: 50,
        y: 50,
        z: 50
    };
    var verticalOffset = {

    }
    var arenaBoundsProperties = {
        dimensions: ARENA_DIMENSIONS,
        color: GREEN,
        position: position
    }
    return arenaBounds;
}

//where enemies emerge from
function createPortal(position) {

}

// # EGGS

//these can be collected, otherwise they hatch into enemies
//they are dropped from the sky and bounce when they hit things
function createEgg(position, name) {

    var egg;
    var eggProperties = DEBUG_ENTITY_PROPERTIES;
    eggProperties.color = WHITE;
    eggProperties.position = position;
    eggProperties.lifetime = EGG_HATCH_DELAY;
    egg = Entities.addEntity(eggProperties);
    Script.setTimeout(function() {
        createEnemyCallback();
    }, EGG_HATCH_DELAY)
    return egg;
}

function collectEgg() {

}

// # ENEMIES
// bounders: red, hunters: grey, shadow lords: blue

function getInfoForEnemyName(name) {
    if (name === 'joust-bounder') {

    }
    if (name === 'joust-hunter') {

    }
    if (name === 'joust-shadowLord') {

    }

    if (name === 'joust-pterodactyl') {

    }
}

function createRider(color, parent) {
    //riders ride the different types of buzzard
}

function createBounder(position) {
    var bounder;
    var debugColor = RED;
    var bounderProperties = DEBUG_ENTITY_PROPERTIES;
    bounderProperties.color = debugColor;
    bounderProperties.position = position;
    // Bounders fly around the environment randomly, occasionally reacting to the protagonist.
    //Knocking a bounder off of it's mount causes an egg to fall. Pick up the egg before it hatches in to a Hunter.
    bounder = Entities.addEntity(bounderProperties);
    return bounder;
}

function createHunter(position) {
    var hunter;
    var debugColor = PURPLE;
    var hunterProperties = DEBUG_ENTITY_PROPERTIES;
    hunterProperties.color = debugColor;
    hunterProperties.position = position;
    // Hunters seek the player's character in an effort to collide. 
    //Hitting a Hunter from above makes an egg appear which you must pick up before it hatches in to a Shadow Lord
    hunter = Entities.addEntity(hunterProperties);
    return hunter;
}

function createShadowLord(position) {
    var shadowLord;
    var debugColor = BLUE;
    var shadowLordProperties = DEBUG_ENTITY_PROPERTIES;
    shadowLordProperties.color = debugColor;
    shadowLordProperties.position = position;
    //  Shadow Lords fly quickly and closer to the top of the screen. Pfutzenrueter designed them to fly higher when close to the protagonist to increase the Shadow Lord's chances of victory against the player
    //An egg will appear, and if it hatches, another Shadow Lord will be waiting inside.
    shadowLord = Entities.addEntity(pterodactylProperties);

    return shadowLord;
}

function createPterodactyl(position) {
    var pterodactyl;
    var debugColor = GREEN;
    var pterodactylProperties = DEBUG_ENTITY_PROPERTIES;
    pterodactylProperties.color = debugColor;
    pterodactylProperties.position = position;
    //The pterodactyl was designed to attack idle players and be difficult to defeat. The only vulnerability was attacking the creature in its open mouth during a specific animation frame. Newcomer and Pfutzenrueter designed the pterodactyl to quickly fly upward at the last moment when approaching a player waiting at the edge of a ledge.
    pterodactyl = Entities.addEntity(pterodactylProperties);
    return pterodactyl;
}

function hideMyAvatar() {
    MyAvatar.shouldRenderLocally = false;
}

function showMyAvatar() {
    MyAvatar.shouldRenderLocally = true;
}

function createLavaTroll(position) {
    var lavaTroll;
    var debugColor = ORANGE;
    lavaTrollProperties.color = debugColor;
    lavaTrollProperties.position = position;
    //he awakens waiting for any bird, friend or foe, to dip just a little too close to the lava. When he sees an unsuspecting victim, he reaches his hand out and tries to grab the feet of the nearest bird. Only persistent flapping will enable the troll's next meal to escape.
    lavaTroll = Entities.addEntity(lavaTrollProperties);
    return lavaTroll;
}

// # ARTIFICIAL INTELLIGENCE


function flee(thisEntity, target) {
    var MAX_SPEED = 1;
    var MAX_FORCE = 1;
    var FLEE_RANGE = 2;
    var targetPosition = Entities.getEntityProperties(target, "position").position;
    var properties = Entities.getEntityProperties(thisEntity, ["position", "velocity"]);
    var location = properties.position;
    var velocity = properties.velocity;

    var desired = Vec3.subtract(location, targetPosition);
    var d = Vec3.length(desired);
    desired = Vec3.normalize(desired);
    desired = Vec3.multiply(MAX_SPEED, desired);
    if (d < FLEE_RANGE) {
        var steer = Vec3.subtract(desired, velocity);
        var steerVector = new V3(desired.x, 0, desired.z);
        steer = steerVector.limit(MAX_FORCE);
        return steer;
    } else {
        //target too far away to flee
        return
    }
}


function seek(thisEntity, target) {
    var MAX_SPEED = 1;
    var MAX_FORCE = 1;
    var FLEE_RANGE = 2;

    var targetPosition = Entities.getEntityProperties(target, "position").position;
    var properties = Entities.getEntityProperties(thisEntity, ["position", "velocity"]);
    var location = properties.position;
    var velocity = properties.velocity;

    var desired = Vec3.subtract(location, targetPosition);
    desired = Vec3.normalize(desired);
    desired = Vec3.multiply(MAX_SPEED, desired);

    var steer = Vec3.subtract(desired, velocity);

    var steerVector = new V3(desired.x, desired.y, desired.z);
    steer = steerVector.limit(MAX_FORCE);

    return steer;


}

function wander(thisEntity) {
    var magnitudeV = 5;
    var properties = Entities.getEntityProperties(thisEntity, ["position", "velocity"]);
    var location = properties.position;
    var velocity = properties.velocity;


    var randomUp;
    var randomRight;



    var directionV = {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() - 0.5
    };

    //print("POS magnitude is " + magnitudeV + " and direction is " + directionV.x);
    Entities.editEntity(self.entityId, {
        velocity: Vec3.multiply(magnitudeV, Vec3.normalize(directionV))

    });


    return newPosition;
}

function avoidOtherEnemies(position) {
    return newPosition;
}

// # COLLISION HANDLING


function determineHighestParticipant(entityA, entityB, collision) {
    var aProps = Entities.getEntityProperties(entityA);
    var bProps = Entities.getEntityProperties(entityB);

    if (aProps.position.y === bProps.position.y) {
        bounceAfterCollision(entityA, entityB);
        return "tie"
    } else if (aProps.position.y > bProps.position.y) {
        createEgg(aProps.position, aProps.name)
        return entityA
    } else {
        createEgg(bProps.position, bProps.name)
        return entityB
    }
}

function addCollisionHandlerToEntity(entityID) {
    Script.addEventHandler(entityID, "collisionWithEntity", determineHighestParticipant);
}

function addEnterHandlerToEgg(egg) {
    Script.addEventHandler(egg, "enterEntity", removeEggAndScore);
}

function removeEggAndScore() {
    Entities.deleteEntity(egg);
    addToScore('eggInAir')
}

function setupArena() {
    ostriches.push(createOstrich());
    distributeLedges();
    lavaPits.push(createLavaPit());
    woodenBridges.push(createWoodenBridge());
    controllers.push(bindController());
}

function distributeLedges() {

    ledgeLocations.forEach(function(position) {
        var ledge = createLedge(position);
        ledges.push(ledge);
    })

    return ledge;
}

// # MESSAGING
function handleMessages(channel, message, senderID) {
    print("message received on channel:" + channel + ", message:" + message + ", senderID:" + senderID);
}

Messages.messageReceived.connect(handleMessages);



// # SCORING
// Dismount a Bounder  500 points
// Dismount a Hunter   750 points
// Dismount a Shadow Lord  1500 points
// Gather the 1st egg  250 points
// Gather the 2nd egg  500 points
// Gather the 3rd egg  750 points
// Gather the 4th egg and beyond   1000 points
// Catch an egg in mid-air 500 point bonus
// Destroy the pterodactyl 1000 points
// Lose a life 50 points
// Dismount the other player   1000 points
// Surviving a Survival Wave   3000 points
// Cooperating in a Team Wave  3000 points
// 1st player kill in a Gladiator Wave 3000 points

function addToScore(scoreType) {
    if (scoreType === 'eggInAir') {
        score += 250;
    }
    if (scoreType === 'bounder') {
        score += 500;
    }
    if (scoreType === 'hunter') {
        score += 750;
    }
    if (scoreType === 'shadowLord') {
        score += 1500;
    }
    if (scoreType === 'pterodactyl') {
        score += 1000;
    }
    if (scoreType === 'lostLife') {
        score += 50;
    }
}

function createScoreDisplay() {
    var display;
    var displayProperties;
    display = Entities.addEntity(displayProperties);
}

//# UTILITIES

function randomSpherePoint(center, radius) {
    var u = Math.random();
    var v = Math.random();
    var theta = 2 * Math.PI * u;
    var phi = Math.acos(2 * v - 1);
    var x = center.x + (radius * Math.sin(phi) * Math.cos(theta));
    var y = center.y + (radius * Math.sin(phi) * Math.sin(theta));
    var z = center.z + (radius * Math.cos(phi));

    return {
        x: x,
        y: y,
        z: z
    };
}

function V3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return
}

V3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

V3.prototype.limit = function(s) {
    var len = this.length();

    if (len > s && len > 0) {
        this.scale(s / len);
    }

    return this;
};

V3.prototype.scale = function(f) {
    this.x *= f;
    this.y *= f;
    this.z *= f;
    return this;
};

var v3 = new V3();

// # CLEANUP
function cleanup() {

}