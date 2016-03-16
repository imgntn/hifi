var HIFI_SIGN_NAME = 'playa_model_sign_rotatingHiFiSignTopOfCrane';

var SIGN_POSITION = {
    x: -50.0,
    y: 28.85,
    z: -31.75
}

var THROTTLE = true;
var THROTTLE_SPREAD = 0;
var throttleRate = 250
var sinceLastUpdate = 0;
var initialized = false;
var octreeQueryInterval;


var hifiSign = null;

function update(deltaTime) {
    if (THROTTLE === true) {
        sinceLastUpdate = sinceLastUpdate + deltaTime * 100;
        if (sinceLastUpdate > throttleRate) {
            throttleRate = Math.random() * THROTTLE_SPREAD;
            sinceLastUpdate = 0;
        } else {
            return;
        }
    }

    if (!initialized) {
        print("checking for servers...");
        if (Entities.serversExist() && Entities.canRez()) {
            print("servers exist -- makeAll...");
            Entities.setPacketsPerSecond(6000);
            print("PPS:" + Entities.getPacketsPerSecond());
            initialized = true;
        }
        return;
    }

    countEntities()

}

var neonUpdateConnected = false;

function countEntities() {

    if (EntityViewer.getOctreeElementsCount() <= 1) {
        Script.setTimeout(function() {
            countEntities();
        }, 1000)
        return;
    }

    var results = Entities.findEntities(SIGN_POSITION, 32000);
    if (results.length === 0) {
        return;
    }

    results.forEach(function(result) {
        var properties = Entities.getEntityProperties(result);
        if (properties.name === HIFI_SIGN_NAME) {
            hifiSign = result;
            if(neonUpdateConnected===false){
                Script.update.connect(updateNeon);
                neonUpdateConnected = true;    
            }
        }
        return
    })

  
}

var neonTextureOn = true;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var NEON_THROTTLE = true;
var throttleRateNeon = 50;
var sinceLastUpdateNeon = 0;

function swapTextures() {

    if (neonTextureOn === true) {
        neonTextureOn = false;
        Entities.editEntity(hifiSign, {
            textures: 'file2:"",\nfile1:"https://s3-us-west-1.amazonaws.com/highfidelity_diffusebaked.png"'
        });
    } else {
        neonTextureOn = true;
        Entities.editEntity(hifiSign, {
            textures: 'file2:"https://s3-us-west-1.amazonaws.com/highfidelitysign_white_emissive.png",\nfile1:"https://s3-us-west-1.amazonaws.com/highfidelity_diffusebaked.png"'
        });
    }
}

function updateNeon(deltaTime) {
    if (NEON_THROTTLE === true) {
        sinceLastUpdateNeon = sinceLastUpdateNeon + deltaTime * 10;
        if (sinceLastUpdateNeon > throttleRateNeon) {
            sinceLastUpdateNeon = 0;
            swapTextures();
            throttleRateNeon = getRandomInt(0, 10);
        } else {
            // print('returning in update ' + sinceLastUpdateNeon)
            return;
        }
    }
}

EntityViewer.setPosition(SIGN_POSITION);
EntityViewer.setKeyholeRadius(32000);
EntityViewer.setVoxelSizeScale(13107200000);
// EntityViewer.setVoxelSizeScale(
// 3.402823e+38);

octreeQueryInterval = Script.setInterval(function() {
    // print('looking in the octree')
    EntityViewer.queryOctree();
}, 1000);

Script.scriptEnding.connect(function() {
    Script.update.disconnect(update);
    Script.update.disconnect(updateNeon);
    neonUpdateConnected = false;
    Script.clearInterval(octreeQueryInterval)
});


Script.update.connect(update);
