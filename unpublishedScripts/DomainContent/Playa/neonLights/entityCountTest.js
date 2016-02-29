var THROTTLE = true;
var THROTTLE_SPREAD = 0;
var throttleRate = 250
var sinceLastUpdate = 0;
var initialized = false;
var octreeQueryInterval;

var basePosition = {
    x: 0,
    y: 0,
    z: 0
};

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


    EntityViewer.setPosition(basePosition);
    EntityViewer.setCenterRadius(32000);
   // EntityViewer.setVoxelSizeScale(200*2^16);
    octreeQueryInterval = Script.setInterval(function() {
        // print('looking in the octree')
        EntityViewer.queryOctree();
    }, 1000);


function countEntities() {

    if (EntityViewer.getOctreeElementsCount() <= 1) {
        Script.setTimeout(function() {
            deleteAllFlickeringLights();
        }, 1000)
        print('JBP countEntities 2')
        return;
    }

    var results = Entities.findEntities(basePosition, 32000);
    print('HOW MANY TOTAL:: ' + results.length)

}

Script.update.connect(update);

Script.scriptEnding.connect(function() {
    Script.update.disconnect(update);
    Script.clearInterval(octreeQueryInterval)
})