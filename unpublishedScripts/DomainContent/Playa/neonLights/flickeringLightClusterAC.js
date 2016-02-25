var LIGHT_DIMENSIONS = {
    x: 0.75,
    y: 0.75,
    z: 0.75,
}

function getLightProperties() {
    var lightProperties = {
        type: 'Light',
        name: 'Hifi-Playa-Flickering-Light',
        dimensions: LIGHT_DIMENSIONS,
        intensity: 1,
        collisionsless: true,
        userData: JSON.stringify({
            grabbableKey: {
                grabbable: false
            }
        })
    }
    return lightProperties;
}


var RED = {
    red: 255,
    green: 0,
    blue: 0
}

var GREEN = {
    red: 0,
    green: 255,
    blue: 0
}

var BLUE = {
    red: 0,
    green: 0,
    blue: 255
}

var PURPLE = {
    red: 255,
    green: 0,
    blue: 255
}


function createLight(color, position, parentID) {
    var props = getLightProperties();
    props.color = color;
    props.position = position;
    props.parentID = parentID;
    var light = Entities.addEntity(lightProperties);
    return light;
}

var FRONT_DISTANCE = 0.5;
var RIGHT_SPACER = 0.5;

function createLightCluster(numberOfLights, parentEntity) {
    print('CREATING LIGHT CLUSTER')
    var parentProps = Entities.getEntityProperties(parentEntity);
    var cluster = [];

    var front = Quat.getFront(parentProps.rotation);
    var frontOffset = Vec3.multiply(FRONT_DISTANCE, front);
    var right = Quat.getRight(parentProps.rotation);
    var i;
    print('JBP CLUSTER 1')

    for (i = 0; i < numberOfLights; i++) {
        var lightPosition = Vec3.sum(parentProps.position, frontOffset);
        if (i !== 0) {
            var rightOffset = Vec3.multiply((RIGHT_SPACER * i), front);

            lightPosition = Vec3.sum(lightPosition, rightOffset);
        }
        print('JBP CLUSTER 2')

        cluster.push(createLight(RED, lightPosition, parentEntity));
        return cluster
    }
    print('JBP CLUSTER 3')

}

function flickerLightsInCluster(cluster) {
    print('flickering the lights for a cluster!!')
    cluster.forEach(function(light) {
        print('flickering light: ' + light)
        Entities.editEntity(light, {
            intensity: getLightValue()
        })
    });
}

function getLightValue() {
    var items = [0.9, 0.7, 0.5, 0.3, 0.1]
    var item = items[Math.floor(Math.random() * items.length)];
    item = item + (Math.random() / 10)
    return item
}

var THROTTLE = true;
var throttleRate = 100
var sinceLastUpdate = 0;
var initialized = false;
var octreeQueryInterval;
var secondaryInit = false;

var basePosition = {
    x: 0,
    y: 0,
    z: 0
}

var clusters = [];

function update(deltaTime) {
    if (THROTTLE === true) {
        sinceLastUpdate = sinceLastUpdate + deltaTime * 100;
        if (sinceLastUpdate > throttleRate) {
            throttleRate = Math.random() * 250;
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
            Script.setTimeout(function() {
                //print('SETTING TIMEOUT')
                deleteAllFlickeringLights()
            }, 10000)

            initialized = true;
        }
        return;
    }

    clusters.forEach(function(cluster) {
        flickerLightsInCluster(cluster);
    })

}

function setUpEntityViewer() {
    EntityViewer.setPosition(basePosition);
    EntityViewer.setKeyholeRadius(60000);
    octreeQueryInterval = Script.setInterval(function() {
        // print('looking in the octree')
        EntityViewer.queryOctree();
        var results = Entities.findEntities(basePosition, 60000);
        // print('looking results length: ' + results.length)
    }, 200);
}

function findLightClusterAnchors() {
    print('LOOKING FOR CLUSTER ANCHORSA')
    var results = Entities.findEntities(basePosition, 60000);
    print('HOW MANY TOTAL:: ' + results.length)
    results.forEach(function(r) {
        var props = Entities.getEntityProperties(r);
        print('JBP ANCHOR 1')

        print('JBP ANCHOR 2')

        var _data = props.userData;
        var data;
        if (_data === "") {
            return;
        }
        try {
            data = JSON.parse(_data);
        } catch (err) {
            print('JBP error parsing json');
            print('JBP properties are:' + _data);
            return;
        }
        print('JBP ANCHOR 4')

        if (data.hasOwnProperty('flickeringLightKey')) {
            print('GOT A LIGHT MAKING A CLUSTER')
            var cluster = createLightCluster(r, 2);
            clusters.push(cluster);
        }

    })
}

function deleteAllFlickeringLights() {
    print('DELETING ALL FLICKERING LIGHTS')
    if (secondaryInit === true) {
        print('JBP RT 1')
        return;
    }

    if (EntityViewer.getOctreeElementsCount() <= 1) {
        Script.setTimeout(function() {
            deleteAllFlickeringLights();
        }, 1000)
        print('JBP RT 2')
        return;
    }
    print('JBP DEL 1')
    var results = Entities.findEntities(basePosition, 60000);

    results.forEach(function(r) {
        var name = Entities.getEntityProperties(r, 'name').name;
        if (name.indexOf('Flickering-Light') > -1) {
            Entities.deleteEntity(r);
        }
    })
    print('JBP DEL 2')
    findLightClusterAnchors();
    secondaryInit = true;
    print('JBP DEL 3')
}
setUpEntityViewer();
Script.update.connect(update);
Script.scriptEnding.connect(function() {
    Script.update.disconnect(update);
})