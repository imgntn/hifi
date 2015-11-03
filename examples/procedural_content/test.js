https://goote.ch/8dc32a3c778e4a53a14a1f0f42359e3a.project/

window._gooScriptFactories['1bb4b09c4abf431293bcb1d672fb57f1.script'] = function () { 
var parameters = [
    {key:'iterations', type:'int', default:5},
    {key:'rooms', type:'int', default:1},
    {key:'halls', type:'int', default:1},
    {key:'xRoads', type:'int', default:1}];
    
function setup(args, ctx, goo){
    ctx.gui = null;
    ctx.ready = false;
    ctx.worldData.refs = [];
    // used to remove entities added after the 'stop' button is pressed
    ctx.worldData.created = [];
    // how many Rooms do we want added?
    ctx.iterations = args.iterations;
    // if this gets too high, there is no room to place a new segment
    ctx.count = 0;
    
    // removes all existing segments to start a new dungeon
    ctx.reset = function(){
        ctx.count = 0;
        ctx.ready = true;
        for(var i = 0, ilen = ctx.worldData.created.length; i < ilen; i++){
            ctx.worldData.created[i].removeFromWorld();
        }
        ctx.worldData.created.length = 0;
        ctx.iterations = args.iterations;
    };

    // main dungeon generation
    ctx.generateDungeon = function(){
        // if we have tried to place a room more than 10 times, but can't
        if(ctx.count > 10){
            ctx.reset();
        }
        // if this is the first room we are placing
        if(ctx.iterations === args.iterations){
            var start = ctx.create('Room');
            // tag it with 'Start' to use later if needed
            start.setTag('Start');
            // move it to 0,0,0
            start.transformComponent.transform.translation.setd(0, 0, 0);
            
            start.traverse(function(b){
                if(b.meshRendererComponent){
                    b.transformComponent.updateTransform();
                    b.transformComponent.updateWorldTransform();
                    b.meshDataComponent.computeBoundFromPoints();
                    b.meshRendererComponent.updateBounds(b.meshDataComponent.modelBound, b.transformComponent.worldTransform);
                }
            });
            
            start.transformComponent.setUpdated();
        }
        else{
            // get all entities with the tag 'Exit'
            var allExits = ctx.world.by.tag('Exit');
            var theExit = null;
            var theType = null;
            // if there is an exit available
            if(allExits.size() > 0){
                // pick a random one out of the list
                theExit = allExits.get(Math.floor(Math.random() * allExits.size()));
                // pick a random segment type from the list available
                theType = theExit.transformComponent.parent.entity.canConnect[Math.floor(Math.random() * theExit.transformComponent.parent.entity.canConnect.length)];
                // create the new segment
                var newLink = ctx.create(theType);
                // attach the new segment to the existing exit we picked above
                ctx.attachAtoB(newLink, theExit);
                // if we are done...
                if(ctx.iterations === 0){
                    console.log("DONE!");
                }
            }
            // if no exits are available
            else{
                ctx.reset();
                return;
            }
        }
    };
    
    // the segment creation 'factory'
    // pass in the string segment Type you want to create (Room, Hall, xRoad)
    ctx.create = function(t){
        // get the list of definitions
        var defs = ctx.world.by.tag(t+"Ref");
        // pick a random one
        var def = defs.get(Math.floor(Math.random()*defs.size()));
        // clone a new entity from the reference
        var ent = goo.EntityUtils.clone(ctx.world, def);
        // set the tag for the new segment
        ent.setTag(t);
        // add the new segment to the world
        ent.addToWorld();
        // add it to the created array, to remove it later
        ctx.worldData.created.push(ent);
        for(var i = 0, child = ent.transformComponent.children, ilen = child.length; i < ilen; i++){
            switch(child[i].entity.name){
                case "RootMesh":
                    if(t === "Room"){
                        ctx.iterations --;
                    }
                    break;
                case "Door":
                    child[i].entity.setTag("Exit");
                    switch(t){
                        // set the type of segments the exits can connect to
                        case "Room":
                            ent.canConnect = ['xRoad', 'Hall'];
                            // hide all the 'DoorMesh' 
                            for(var j = 0, door = child[i].entity.transformComponent.children, jlen = door.length; j < jlen; j++){
                                if(door[j].entity.name === "DoorMesh"){
                                    goo.EntityUtils.hide(door[j].entity);
                                }
                            }
                            break;
                        case "Hall":
                            ent.canConnect = ['xRoad', 'Room'];
                            break;
                        case "xRoad":
                            ent.canConnect = ['Room', 'Hall'];
                            break;
                    }
                    break;
            }
        }
        
        ent.traverse(function(b){
            if(b.meshRendererComponent){
                b.transformComponent.updateTransform();
                b.transformComponent.updateWorldTransform();
                b.meshDataComponent.computeBoundFromPoints();
                b.meshRendererComponent.updateBounds(b.meshDataComponent.modelBound, b.transformComponent.worldTransform);
            }
        });
        
        return ent;
    };
    
    // attaches the new segment aEnt to the existing exit bDoor
    ctx.attachAtoB = function(aEnt, bDoor){
        // assemble an array of current exits on the new segment
        ctx.aDoor = ctx.aDoor || [];
        for(var i = 0, child = aEnt.transformComponent.children, ilen = child.length; i < ilen; i++){
            if(child[i].entity.hasTag("Exit")){
                ctx.aDoor.push(child[i].entity);
            }
        }
        // pick a random door from the array
        var aDoor = ctx.aDoor[Math.floor(Math.random() * ctx.aDoor.length)];
        
        // get the LOCAL normal pointing away from the door
        ctx.normal0 = ctx.normal0 || new goo.Vector3();
        for(var i = 0, ilen = aDoor.transformComponent.children.length; i < ilen; i++){
            if(aDoor.transformComponent.children[i].entity.name === "Normal"){
                goo.Vector3.subv(aDoor.transformComponent.worldTransform.translation, aDoor.transformComponent.children[i].entity.transformComponent.transform.translation, ctx.normal0);
                break;
            }
        }
        ctx.normal0.normalize();
        
        // get the parent of the existing door
        var bEnt = bDoor.transformComponent.parent.entity;
        // get the WORLD normal pointint away from the existing door
        ctx.normal1 = ctx.normal1 || new goo.Vector3();
        for(var i = 0, ilen = bDoor.transformComponent.children.length; i < ilen; i++){
            if(bDoor.transformComponent.children[i].entity.name === "Normal"){
                goo.Vector3.subv(bDoor.transformComponent.children[i].entity.transformComponent.worldTransform.translation, bDoor.transformComponent.worldTransform.translation, ctx.normal1);
                break;
            }
        }
        ctx.normal1.normalize();
        
        // determine the radians of each normal
        var rad0 = Math.atan2(ctx.normal0.z, ctx.normal0.x);
        var rad1 = Math.atan2(ctx.normal1.z, ctx.normal1.x);
        
        // subtract to determine the new rotation needed for the new segment
        rad0 -= rad1;
        
        // roate the new segment
        aEnt.transformComponent.transform.rotation.fromAngles(0, rad0, 0);
        // move the new segment to the existing door
        aEnt.transformComponent.transform.translation.copy(bDoor.transformComponent.worldTransform.translation);
        
        // move the new room into place, based on the local translation of the new exit
        ctx.doorOffset = ctx.doorOffset || new goo.Vector3();
        ctx.doorOffset.copy(aDoor.transformComponent.transform.translation);
        aEnt.transformComponent.transform.applyForwardVector(ctx.doorOffset, ctx.doorOffset);
        aEnt.transformComponent.transform.translation.subv(ctx.doorOffset);
        aEnt.transformComponent.setUpdated();
        
        aEnt.transformComponent.updateTransform();
        aEnt.transformComponent.updateWorldTransform();
        
        // get all the current segments to check for bounds
        var collection = ctx.world.by.tag("Room");
        var halls = ctx.world.by.tag("Hall");
        var xRoads = ctx.world.by.tag("xRoad");
        collection.and(halls);
        collection.and(xRoads);
        
        aEnt.traverse(function(b){
            if(b.meshRendererComponent){
                b.transformComponent.updateTransform();
                b.transformComponent.updateWorldTransform();
                b.meshDataComponent.computeBoundFromPoints();
                b.meshRendererComponent.updateBounds(b.meshDataComponent.modelBound, b.transformComponent.worldTransform);
            }
        });

        var collides = false;
        aEnt.traverse(function (e1){
            if (e1.meshRendererComponent){
                if(e1.name !== "RootMesh"){return;}
                var worldBound = e1.meshRendererComponent.worldBound;
                if(worldBound !== null){
                    for (var i = 0, ilen = collection.size(); i < ilen; i++) {
                        var ent = collection.get(i);
                        if(ent !== aEnt){
                            ent.traverse(function (e2){
                                if(e2.meshRendererComponent){
                                    if(e2.name !== "RootMesh"){return;}
                                    if(e2.meshRendererComponent.worldBound){
                                        var wb2 = e2.meshRendererComponent.worldBound;
                                        if(Math.abs(worldBound.center.x - wb2.center.x) < ((worldBound.xExtent + wb2.xExtent)-0.1)){
                                            if(Math.abs(worldBound.center.z - wb2.center.z) < ((worldBound.zExtent + wb2.zExtent)-0.1)){
                                                if(Math.abs(worldBound.center.y - wb2.center.y) < ((worldBound.yExtent + wb2.yExtent)-0.1)){
                                                    collides = true;
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        if (true === collides) {
                            return false;
                        }
                    }
                }
            }
        });
        // if the new segment collides with an old one, remove it
        if(true === collides){
            ctx.count ++;
            if(aEnt.hasTag("Room")){
                ctx.iterations ++;
            }
            ctx.worldData.created.splice(ctx.worldData.created.indexOf(aEnt), 1);
            aEnt.removeFromWorld();
        }
        // if there is no collision, clear the 'Exit' tags on both doors
        // hide the wall meshes where they segments connect, and show the door
        // if there is one
        else{
            ctx.count = 0;
            aDoor.clearTag("Exit");
            bDoor.clearTag("Exit");
            for(var a = 0, aMesh = aDoor.transformComponent.children, alen = aMesh.length; a < alen; a++){
                if(aMesh[a].entity.name === "DoorMesh"){
                    goo.EntityUtils.show(aMesh[a].entity);
                }
                if(aMesh[a].entity.name === "WallMesh"){
                    goo.EntityUtils.hide(aMesh[a].entity);
                }
            }
            for(var a = 0, aMesh = bDoor.transformComponent.children, alen = aMesh.length; a < alen; a++){
                if(aMesh[a].entity.name === "DoorMesh"){
                    goo.EntityUtils.show(aMesh[a].entity);
                }
                if(aMesh[a].entity.name === "WallMesh"){
                    goo.EntityUtils.hide(aMesh[a].entity);
                }
            }
        }
        ctx.aDoor.length = 0;
    };
    
    // detects if everything has been initialized before
    // allowing the update cycle to continue
    var init = function(){
        // makes sure the rooms, halls, and xRoads are all loaded
        var room…