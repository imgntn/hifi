function flickerLight(light) {
    print('flickering light')
    Entities.editEntity(light, {
        intensity: getLightValue()
    })
}

function getLightValue() {
    var items = [3, 7, 11, 17, 23, 27, 31]
    var item = items[Math.floor(Math.random() * items.length)];
    item = item + (Math.random() / 10)
    return item
}

var lights = [];
function findLights() {
    print('finding lights')
    lights = [];
    var res = Entities.findEntities(MyAvatar.position, 10000);
    res.forEach(function(r) {
        var props = Entities.getEntityProperties(r);
        if (props.name.indexOf('jbp') > -1) {
           if(lights.indexOf(r)>-1){
            return
           }
           else{
            lights.push(r);
           } 
        }
    })
}


var THROTTLE = true;
var THROTTLE_SPREAD = 100;
var throttleRate = 50
var sinceLastUpdate = 0;
function update(deltaTime) {
   // print('myupdate')
    if (THROTTLE === true) {
        sinceLastUpdate = sinceLastUpdate + deltaTime * 100;
        if (sinceLastUpdate > throttleRate) {
            throttleRate = Math.random() * THROTTLE_SPREAD;
            sinceLastUpdate = 0;
        } else {
            return;
        }
    }
    findLights();
    print('flicker a light' + lights.length)
    lights.forEach(function(light){
        flickerLight(light)
    })
}

Script.update.connect(update)

Script.scriptEnding.connect(function(){
    Script.update.disconnect(update);
})