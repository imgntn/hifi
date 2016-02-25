var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0.5,
    z: 0
}), Vec3.multiply(2.5, Quat.getFront(Camera.getOrientation())));


var onBlock, offBlock;
var EMIT_OFF_MODEL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Junkyard/neonLights/emitno_b.fbx';

var EMIT_ON_MODEL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Junkyard/neonLights/emityes.fbx';

function getModelProperties() {
    var modelProperties = {
        type: 'Model',
        position: center,
        dimensions: {
            x: 2,
            y: 2,
            z: 2
        },
        visible: false,
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
    offProps.modelURL = EMIT_OFF_MODEL;
    offBlock = Entities.addEntity(offProps);
}