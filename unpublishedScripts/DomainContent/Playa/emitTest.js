var SWAP_TEXTURES=true;

var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0.5,
    z: 0
}), Vec3.multiply(2.5, Quat.getFront(Camera.getOrientation())));

var SIGN_DIMENSIONS = {
    x: 2.68,
    y: 2.75,
    x: 0.59
}

var onBlock, offBlock;
var EMIT_OFF_MODEL = 'http://hifi-content.s3.amazonaws.com/james/emit_test/hifi_circularsign_noneon.fbx';
var OFF_TEXTURE_URL = 'http://hifi-content.s3.amazonaws.com/james/emit_test/highfidelity_diffusebaked.png';
var EMIT_ON_MODEL = 'http://hifi-content.s3.amazonaws.com/james/emit_test/hifi_circularsign.fbx';
var ON_TEXTURE_URL = 'http://hifi-content.s3.amazonaws.com/james/emit_test/hifi_emissive.png';

function getModelProperties() {
    var modelProperties = {
        type: 'Model',
        position: center,
        dimensions: SIGN_DIMENSIONS,
        visible: true,
        collisionsless: false,
        dynamic: true,
        userData: JSON.stringify({
            grabbableKey: {
                grabbable: false
            }
        })

    }

    return modelProperties
}


function addModels() {
    var onProps = getModelProperties();
    onProps.modelURL = EMIT_ON_MODEL;
    onBlock = Entities.addEntity(onProps);

    var offProps = getModelProperties();
    offProps.visible = false;
    offProps.modelURL = EMIT_OFF_MODEL;
    offBlock = Entities.addEntity(offProps);
}

var onBlockVisible = true;
var offBlockVisible = false;

function swapVisibility() {
    if (onBlockVisible !== true) {
        onBlockVisible = true;
        Entities.editEntity(onBlock, {
            visible: true
        })
        Script.setTimeout(function() {
            offBlockVisible = false;
            Entities.editEntity(offBlock, {
                visible: false
            })
        }, 10)

        return;
    }

    if (onBlockVisible === true) {
        offBlockVisible = true;
        Entities.editEntity(offBlock, {
            visible: true
        })
        Script.setTimeout(function() {
            onBlockVisible = false;
            Entities.editEntity(onBlock, {
                visible: false
            })
        }, 10)

        return;
    }

}

var neonTextureOn = true;

function swapTextures() {
    if (neonTextureOn === true) {
        neonTextureOn = false;
        Entities.editEntity(onBlock, {
            textures: 'file2:"",\nfile1:"http://hifi-content.s3.amazonaws.com/highfidelity_diffusebaked.png"'
        })
    } else {
        neonTextureOn = true;
        Entities.editEntity(onBlock, {
            textures: 'file2:"http://hifi-content.s3.amazonaws.com/highfidelitysign_white_emissive.png",\nfile1:"http://hifi-content.s3.amazonaws.com/highfidelity_diffusebaked.png"'
        })
    }
}





function addSingleModel() {
    var onProps = getModelProperties();
    onProps.modelURL = EMIT_ON_MODEL;
    onBlock = Entities.addEntity(onProps);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var THROTTLE = true;
var throttleRate = 50;
var sinceLastUpdate = 0;

function update(deltaTime) {
    if (THROTTLE === true) {
        sinceLastUpdate = sinceLastUpdate + deltaTime * 10;
        if (sinceLastUpdate > throttleRate) {
            sinceLastUpdate = 0;
            if (SWAP_TEXTURES == true) {
                swapTextures();
            } else {
                swapVisibility();
            }
            throttleRate = getRandomInt(0, 10);
        } else {
            // print('returning in update ' + sinceLastUpdate)
            return;
        }
    }
}

function cleanup() {
    Entities.deleteEntity(onBlock);
    Entities.deleteEntity(offBlock);
    Script.update.disconnect(update);
}
if (SWAP_TEXTURES == true) {
    addSingleModel();
} else {
    addModels();
}

Script.update.connect(update);
Script.scriptEnding.connect(cleanup);