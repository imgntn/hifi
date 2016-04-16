var SCRIPT_URL = Script.resolvePath('entity_scripts/soundMaker.js');
var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0.5,
    z: 0
}), Vec3.multiply(1, Quat.getFront(Camera.getOrientation())));

var soundMakerProperties = {
    position: center,
    dimensions: {
        x: 1,
        y: 1,
        z: 1
    },
    color: {
        red: 0,
        green: 0,
        blue: 255
    },
    script: SCRIPT_URL
}

var soundMaker = Entities.addEntity(soundMakerProperties);

Script.stop();