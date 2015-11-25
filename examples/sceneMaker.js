var Scene = function(name) {
    this.name = name || 'generic';
    print('subscribing the scene to messages')
    Messages.subscribe('Hifi-Scene-Add');
    Messages.subscribe('Hifi-Scene-Reset');
    return this
}

Scene.prototype = {
    registrationStrings: [],
    metaObjects: [],
    init: function() {
        this.connectGeneralMessageHandlers();
    },
    connectGeneralMessageHandlers: function() {
        Messages.messageReceived.connect(this.handleIncomingMessages);
    },
    registerObject: function(name, spawnerScript, startPosition, startRotation) {
        var path = Script.resolvePath(spawnerScript);
        print('SPAWNER SCRIPT PATH:::' + path);
        var includeString = spawnerScript + "?startPosition=" + escape(JSON.stringify(startPosition)) + "&startRotation=" + escape(JSON.stringify(startPosition));

        this.metaObjects.push(
            name: name,
            spawnerScript:spawnerScript,
            startPosition: startPosition,
            startRotation: startRotation,
            includeString:includeString
        )

        return includeString
            //and in your script
            //JSON.parse(unescape(epos))
    },

    unregisterObject: function(name) {
        var objectsToUnregister = lookupRegisteredObjectsByName();

        var index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    },
    clearRegisteredObjects: function() {
        this.registerObjects.forEach(function(rObject) {
            Entities.deleteEntity(rObject);
        })
    },

    resetMetaObjects: function() {
        this.metaObjects.forEach(function(metaObject) {
            Entities.editEntity(metaObject.objectID, {
                position: metaObject.startPosition,
                rotation: metaObject.startRotation
            });
        })
    },
    unregisterObjectsByName:function(name){
        var result = this.metaObjects.filter(function(obj) {
            return obj.name !== name;
        });
        metaObjects = result;
    },

    lookupRegisteredObjectsByName: function(name) {
        var result = this.metaObjects.filter(function(obj) {
            return obj.name === name;
        });
        if (result.length > 0) {
            return result
        } else {
            return false
        }
    }
    handleIncomingMessages: function(channel, message, senderID) {
        print("message received on channel:" + channel + ", message:" + message + ", senderID:" + senderID);
        if (channel === 'Hifi-Scene-Add') {
            print('message in add is:::' + message)
            var objects = this.lookupRegisteredObjectsByName()
        }
        if (channel === 'Hifi-Scene-Reset') {
            print('should reset scene')
        }
    }

}