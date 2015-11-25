Script.include('../sceneMaker.js');

var house = new Scene();
house.init();

house.registerObject('first_flashlight', 'sceneMaker/createFlashlight.js', {
    x: 100,
    y: 0,
    z: 100
}, Quat.fromPitchYawRollDegrees(90, 0, 90));

// house.unRegisterObject('first_flashlight');