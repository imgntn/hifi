var SCRIPT_URL = Script.resolvePath('entity_scripts/soundMaker.js');
var MODEL_URL = "http://hifi-production.s3.amazonaws.com/tutorials/soundMaker/bell.fbx";

var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0.5,
    z: 0
}), Vec3.multiply(1, Quat.getFront(Camera.getOrientation())));

function makeBell(){
    var soundMakerProperties = {
    position: center,
    type:'Model',
    modelURL:MODEL_URL,
    script: SCRIPT_URL
}

var soundMaker = Entities.addEntity(soundMakerProperties);
Script.stop();
}

makeBell();