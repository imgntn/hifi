var SCRIPT_URL = Script.resolvePath('entity_scripts/pictureFrame.js');
var MODEL_URL = "";

var NASA_API_ENDPOINT = ""

function getPictureOfTheDay(){

}

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
    modelURL:MODEL_URL,
    script: SCRIPT_URL
}

var soundMaker = Entities.addEntity(soundMakerProperties);

Script.stop();