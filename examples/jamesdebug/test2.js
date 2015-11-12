(function() {

    function Test() {
        return
    }

    Test.prototype = {
        startNearGrab: function() {
            print('START NEAR GRAB' + this.testID)
            Entities.callEntityMethod(this.testID, 'someMethod')
        },

        preload: function(entityID) {
            print('LOADED SCRIPT YO')
            this.entityID = entityID;
            print('EID::'+this.entityID)
            var props = Entities.getEntityProperties(this.entityID, "userData");
            print('ud'+props.userData)
            this.testID = JSON.parse(props.userData).testKey.id
            print('AFTER PROPS'+ this.testID )

        }

    }

    return new Test();

})