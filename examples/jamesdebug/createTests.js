var test1 = Script.resolvePath('test.js?'+Math.random())
var test2 = Script.resolvePath('test2.js?'+Math.random())

var properties = {
    type: 'Box',
    color: {
        red: 255,
        green: 0,
        blue: 0
    },
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    dimensions: {
        x: 1,
        y: 1,
        z: 1
    },
    script: test1
}

var properties2 = {
    type: 'Box',
    color: {
        red: 255,
        green: 0,
        blue: 255
    },
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
    collisionsWillMove: true,
    script: test2,
    userData:JSON.stringify({
        testKey: {
            id: Entities.addEntity(properties)
        }
    }) 
}

var top = Entities.addEntity(properties2);


Script.scriptEnding.connect(function(){
    Entities.deleteEntity(top)
  //  Entities.deleteEntity(bottom)
})