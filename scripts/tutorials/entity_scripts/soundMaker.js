(function(){ 

    var soundURL ='http://hifi-production.s3.amazonaws.com/tutorials/soundMaker/belltone.wav';
    var ringSound;

    this.preload = function(entityID) { 
        print("preload("+entityID+")");
        ringSound = SoundCache.getSound(soundURL);
    }; 

    this.clickDownOnEntity = function(entityID, mouseEvent) { 
        var bellPosition = Entities.getEntityProperties(entityID).position;
        print("clickDownOnEntity()...");
        Audio.playSound(ringSound,  {
            position: bellPosition,
            volume: 0.5
            });
    }; 
})
