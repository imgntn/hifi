var entities = {};

function onEntityAdded(entityID) {
    print("Added entity", entityID);

    // print("Entities", JSON.stringify(Object.keys(entities)));
}

function onEntityRemoved(entityID) {
    print("Removed entity", entityID);

}

function onEntitiesCleared() {
    print("Entities cleared");

}

function lookForStuff(){
    var results = Entities.findEntities({ x: 0, y: 0, z: 0 }, 60000);
    print('HOW MANY TOTAL:: ' + results.length)
}

Entities.addingEntity.connect(onEntityAdded);
Entities.deletingEntity.connect(onEntityRemoved);
Entities.clearingEntities.connect(onEntitiesCleared);

// Setup entity viewer
EntityViewer.setPosition({ x: 0, y: 0, z: 0 });
EntityViewer.setKeyholeRadius(60000);
Script.setInterval(function() {
    EntityViewer.queryOctree();
    lookForStuff();
}, 1000);