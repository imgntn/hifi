var BASE_CUBE_SIDE = 0.25;
var BASE_CUBE_DIMENSIONS = {
    x: BASE_CUBE_SIDE,
    y: BASE_CUBE_SIDE,
    z: BASE_CUBE_SIDE,
};

var IS_VIVE_CONTROLLER = false;
var IS_HYDRA_CONTROLLER = true;
var VIVE_CONTROLLER_FACES = 4;
var HYDRA_CONTROLLER_FACES = 3;

//same width and height for now
var GRID_UNITS = 4;
var CELL_WIDTH = BASE_CUBE_DIMENSIONS.x / GRID_UNITS;

var MENU_ENTITY_DIMENSIONS = {
    x: CELL_WIDTH - (CELL_WIDTH / GRID_UNITS)
    y: CELL_WIDTH - (CELL_WIDTH / GRID_UNITS)
    z: CELL_WIDTH - (CELL_WIDTH / GRID_UNITS)
};

function HandCubeInterface() {

    this.init = function() {
        this.setNumberOfFaces();
    };

    this.setNumberOfFaces = function() {
        if (IS_VIVE_CONTROLLER === true) {
            this.numberOfFaces = VIVE_CONTROLLER_FACES
        }
        if (IS_HYDRA_CONTROLLER === true) {
            this.numberOfFaces = HYDRA_CONTROLLER_FACES
        }
    };

    this.createBaseCube = function() {
        var properties = {
            name: 'Hifi-HandCube-Base',
            type: 'Box',
            dimensions: BASE_CUBE_DIMENSIONS,
            color: {
                red: 0,
                green: 255,
                blue: 0
            }
            shapeType: 'box',
            collisionsWillMove: true,
            ignoreForCollsions: true,
        };

        this.baseCube = Entities.addEntity(properties);
    };

    this.fillBaseCube = function() {
        var i;
        for (i = 0; i < this.numberOfFaces; i++) {
            fillFaceFromMenuItems(i);
        }
    };

    this.getMenuItemPosition = function(topCorner, faceRotation, column, row) {

        var faceNormal; //TODO: get face normal ask eric
        var rightVector = Quat.getRight(faceNormal);
        var downVector = Vec3.multiply(-1, Quat.getUp(faceNormal));

        var rightPosition = Vec3.sum(topCorner, Vec3.multiply(column, rightVector));
        var downPosition = Vec3.sum(topCorner, Vec3.multiply(row, rightVector));

        var finalPosition = Vec3.sum(rightPosition, , downPosition);
        return position;
    };

    this.setMenuItemPosition = function(){
        
    }

    this.getMenuItemRotation = function(faceRotation) {

    };

    this.createMenuEntity = function(position) {
        var properties = {
            name: 'Hifi-Handcube-Menu-Item',
            type: 'Box',
            collisionsWillMove: false,
            ignoreForCollsions: true,
            parentID: this.baseCube,
            dimensions: MENU_ENTITY_DIMENSIONS,
            color: {
                red: 0,
                green: 0,
                blue: 255
            },
            position: this.getMenuItemPosition,
            rotation: this.getMenuItemRotation,
        }
        Entities.addEntity(properties);
    };

    this.handleItemSelection = function(item) {
        Entities.callEntityMethod(item, "onCubeUISelection");
    };
}

var handCubeInterface;
var baseHand = 'left';

function createHandCubeInterface() {
    handCubeInterface = new HandCubeInterface(baseHand);
}