(function() {
	Script.include("../../libraries/utils.js");

	var defaultSoundData = {
		soundURL: null
	};

	var _this;

	function XylophoneKey() {
		_this = this;
		return;
	}
	var checkPlayingInterval = null;
	XylophoneKey.prototype = {
		isPlaying: false,
		sound: null,
		injector: null,
		collisionWithEntity: function(thisEntity, otherEntity, collision) {
			var soundOptions = {
				localOnly: true,
				position: collision.contactPoint,
				volume: 0.5
			};


			if (this.sound !== null && this.isPlaying !== true) {
				this.injector = Audio.playSound(this.sound, soundOptions);
				this.isPlaying = true;
				print('INJECTOR'+this.injector)
				// if (checkPlayingInterval === null) {
				// 	checkPlayingInterval = Script.setInterval(checkIsPlaying, 1000);
				// }

			}
		},

		preload: function(entityID) {
			this.entityID = entityID;
			var soundData = getEntityCustomData("soundKey", entityID, defaultSoundData);
			this.sound = SoundCache.getSound(soundData.soundURL);

		}

	};

	function deleteEntity(entityID) {
		if (entityID === _this.entityID) {
			Script.clearInterval(checkPlayingInterval);
			Entities.deletingEntity.disconnect(deleteEntity);
		}
	};

	function checkIsPlaying() {
		if (_this.injector !== null && _this.sound !== null) {
			print('isPlaying???', _this.injector)
				//_this.isPlaying = _this.injector.isPlaying;


		}
	}
	Entities.deletingEntity.connect(deleteEntity);

	return new XylophoneKey();


});