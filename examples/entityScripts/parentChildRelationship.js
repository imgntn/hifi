var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0.5,
    z: 0
}), Vec3.multiply(1.5, Quat.getFront(Camera.getOrientation())));

var firstParentProps = {
    name: 'Hifi-Parent-Cube-First',
    type: 'Box',
    position: center,
    dimensions: {
        x: 1,
        y: 1,
        z: 1
    },
    color: {
        red: 255,
        green: 0,
        blue: 255
    },
    // gravity: {
    //     x: 0,
    //     y: -2.8,
    //     z: 0
    // },
    velocity: {
        x: 0,
        y: 0.01,
        z: 0
    },
    angularVelocity: {
        x: -1,
        y: 0,
        z: 0
    },
    collisionsWillMove: true

}

var firstParent = Entities.addEntity(firstParentProps);

var childCubeProps = {
    name: 'Hifi-Child-Cube',
    type: 'Box',
    parentID: firstParent,
    position: {
        x: 0,
        y: 2,
        z: 0
    },
    dimensions: {
        x: 1,
        y: 1,
        z: 1
    },
    rotation: Quat.fromPitchYawRollDegrees(0, 45, 0),
    color: {
        red: 0,
        green: 255,
        blue: 0
    },
    collisionsWillMove: true

}

var childCube = Entities.addEntity(childCubeProps);

var siblingOfChildProps = {
    name: 'Hifi-Sibling-Of-Child-Cube',
    type: 'Box',
    parentID: firstParent,
    position: {
        x: 1,
        y: -2,
        z: 3
    },
    dimensions: {
        x: 1,
        y: 1,
        z: 1
    },
    rotation: Quat.fromPitchYawRollDegrees(25, 45, 0),
    color: {
        red: 0,
        green: 0,
        blue: 255
    },
    collisionsWillMove: true

}

var siblingOfChild = Entities.addEntity(siblingOfChildProps);

var childOfChildProps = {
    name: 'Hifi-Child-of-Child-Cube',
    type: 'Box',
    parentID: childCube,
    position: {
        x: 1,
        y: 2,
        z: 1
    },
    dimensions: {
        x: 1,
        y: 1,
        z: 1
    },
    rotation: Quat.fromPitchYawRollDegrees(15, 45, 60),
    color: {
        red: 255,
        green: 0,
        blue: 0
    },
    collisionsWillMove: true

}

var childOfChild = Entities.addEntity(childOfChildProps);

// THIS CRASHES INTERFACE HARD
// Script.setTimeout(function(){
//     Entities.editEntity(childCube,{
//         parentID:null
//     })
//
// THIS ALSO CRASHES INTERFACE HARD
//     Entities.editEntity(childCube,{
//     parentID: '123'
// })
// },500);


Script.setTimeout(function() {

    //THIS SEEMS OFF - IT HICCUPS THEN TAKES A SECOND TO PICK  UP CHANGES - DOESNT MATTER WHICH CHILD/SIBLING
    // Entities.editEntity(childCube,{
    //     position:{
    //         x:0,
    //         y:3,
    //         z:0
    //     }
    // })


    //DELETES ANY CHILD ENTITIES WHEN DELETED - EXPECTED?  
    //LEFT WITH: NOTHING
    //Entities.deleteEntity(firstParent);

    // LEFT WITH: PARENT AND SIBLING -- OK
    // Entities.deleteEntity(childCube);

    //LEFT WITH: PARENT, CHILD, CHILD OF CHILD -- OK
    // Entities.deleteEntity(siblingOfChild);

    // LEFT WITH: PARENT, CHILD, SIBLING -- OK
    // Entities.deleteEntity(childOfChild);
}, 500);


Script.scriptEnding.connect(function() {
    Entities.deleteEntity(firstParent);
    Entities.deleteEntity(childCube);
    Entities.deleteEntity(siblingOfChild);
    Entities.deleteEntity(childOfChild);
})