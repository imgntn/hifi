var FIRE_DIMENSIONS = {
    x: 1,
    y: 1,
    z: 1
};

var INITIAL_FIRE_PROPERTIES = {
    name: 'Fire',
    type: 'Box',
    visible: true,
    dimensions: FIRE_DIMENSIONS,
    lifetime: 60,
    color: {
        red: 255,
        green: 0,
        blue: 0
    },
    userData: JSON.stringify({
        fireKey: {
            isFire: true,
            isFuel: false
        }
    })
};

var INITIAL_FUEL_PROPERTIES = {
    name: 'FUEL SOURCE',
    type: 'Box',
    visible: true,
    color: {
        red: 0,
        green: 0,
        blue: 255
    },
    dimensions: FIRE_DIMENSIONS,
    userData: JSON.stringify({
        fireKey: {
            isBurning: false,
            isFire: false,
            isFuel: true,
            heatIndex: 0
        }
    })
};


var fires = [];
var fuelSources = [];

function createFires() {
    var properties = INITIAL_FIRE_PROPERTIES;
    properties.position = {
        x: 10,
        y: 0,
        z: 10
    };
    var fire = Entities.addEntity(properties);
    fires.push(fire);
}

function createFuelSources() {
    var properties = INITIAL_FUEL_PROPERTIES;
    properties.position = {
        x: 15,
        y: 0,
        z: 15
    };
    var fuelSource = Entities.addEntity(properties);
}


function cleanup() {
    while (fires.length > 0) {
        Entities.deleteEntity(fires.pop());
    }
    while (fuelSources.length > 0) {
        Entities.deleteEntity(fuelSources.pop());
    }
}

Script.scriptEnding.connect(cleanup);

createFires();
createFuelSources();