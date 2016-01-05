var EQUIRECTANGULAR_SCREEN_URL = 'http://hifi-content.s3.amazonaws.com/james/projection_objects/fbx/roundscreen.fbx';
var 360 _PANORAMA_SCREEN_URL = 'http://hifi-content.s3.amazonaws.com/james/projection_objects/fbx/360screen2.fbx';
var IMAX_SCREEN_URL = 'http://hifi-content.s3.amazonaws.com/james/projection_objects/fbx/curvescreenfinal.fbx';

var EQUIRECTANGULAR_EXAMPLE_URL = 'http://hifi-content.s3.amazonaws.com/james/projection_objects/equitest1.jpg';
var 360 _PANORAMA_EXAMPLE_URL = 'http://hifi-content.s3.amazonaws.com/james/projection_objects/LouvrePanorama900.jpg';
var IMAX_SCREEN_EXAMPLE_URL = '';

var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0.5,
    z: 0
}), Vec3.multiply(1, Quat.getFront(Camera.getOrientation())));

function createEquirectangularScreen() {

    var properties = {
        name: 'Hifi-Equirectangular',
        position: center,
        dimensions: {
            x: 1,
            y: 1,
            z: 1
        }
    }
    return Entities.addEntity(properties);

}

function create360PanoramaScreen() {
    var properties = {
        name: 'Hifi-Equirectangular',
        position: center,
        dimensions: {
            x: 0.24,
            y: 0.09,
            z: 0.24
        }
    }
    return Entities.addEntity(properties);
}

function createImaxScreen() {

    return Entities.addEntity(properties);

}