var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0.5,
    z: 0
}), Vec3.multiply(0.5, Quat.getFront(Camera.getOrientation())));


var wearable;

function createWearable() {
    var properties = {
        type: 'Box',
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
        collisionsWillMove: true,
        ignoreForCollisions: true,
        userData: JSON.stringify({
            "grabbableKey": {
                "invertSolidWhileHeld": false
            },
            "wearable": {
                "joints": ["head", "Head", "hair", "neck"]
            }
        })
    }
    wearable = Entities.addEntity(properties);
}

createWearable();

function cleanup(){
    Entities.deleteEntity(wearable);
}

Script.scriptEnding.connect(cleanup)