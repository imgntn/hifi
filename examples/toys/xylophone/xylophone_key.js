(function() {

	var XYLOHPONE_USER_DATA_KEY = 'hifi_xylophone';

	function XylophoneKey() {
		return;
	}

	XylophoneKey.prototype = {
		collisionWithEntity: function(thisEntity, otherEntity, collision) {
			var soundOptions = {
				position: collision.collisionPoint
			}

			var otherProperties = Entities.getEntityProperties(otherEntity, "name", "velocity");
			// this is our assumed boombox data if it's not known


			// this handy function getEntityCustomData() is available in utils.js and it will return just the specific section
			// of user data we asked for. If it's not available it returns our default data.


			Audio.playSound(this.soundURL, soundOptions);
		},

		preLoad: function(entityID) {
			var defaultCustomData = {
				note: null
			};
			var keyData = getEntityCustomData(XYLOHPONE_USER_DATA_KEY, entityID, defaultCustomData);
			this.note = getEntityCustomData(entityID, 'xylophone_note')
		}
	}

	return new XylophoneKey();

})