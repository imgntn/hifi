(function() {
    var self;

    function QuakeMarker() {
        self = this;

        return this;
    }


    QuakeMarker.prototype = {
        preload: function(entityId) {
            print('JBP YO');
            this.entityId = entityId;
            this.properties = Entities.getEntityProperties(entityId);
        },
        clickDownOnEntity: function() {
            print('JBP i am:: ' + this.properties.name);
            this.makeText();
        },
        hoverEnterEntity:function(){
          Entities.editEntity(this.entityId,{color:{red:0,green:255,blue:155}});
        },
        hoverLeaveEntity:function(){
            Entities.editEntity(this.entityId,{color:this.properties.color});
        },
        makeText: function() {
            this.avatarRot = Quat.fromPitchYawRollDegrees(0, MyAvatar.bodyYaw, 0.0);
            var LABEL_WIDTH = 0.25
            var PER_LETTER_SPACING = 0.1;
            var SPACER_AMOUNT = 2;
            var textWidth = this.properties.name.length * PER_LETTER_SPACING;
            var spacerVector = Quat.getFront(this.avatarRot);
            var spacer = Vec3.multiply(SPACER_AMOUNT, spacerVector)
            spacer = Vec3.sum(spacer, {
                x: 0,
                y: 0.5,
                z: 0
            })
            var labelProperties = {
                name: 'Hifi-Slider-Label-' + this.sliderType,
                type: 'Text',
                dimensions: {
                    x: textWidth,
                    y: 0.2,
                    z: 0.1
                },
                textColor: {
                    red: 255,
                    green: 255,
                    blue: 255
                },
                text: this.properties.name,
                lineHeight: 0.14,
                backgroundColor: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                position: Vec3.sum(MyAvatar.position, spacer),
                rotation: this.avatarRot,
                lifetime: 4,
            }
            print('JBP BEFORE CREATE LABEL' + JSON.stringify(labelProperties));
            this.label = Entities.addEntity(labelProperties);
        },

        destroyText: function() {
            Entities.deleteEntity(this.label);
        },

    }

    return new QuakeMarker()
})