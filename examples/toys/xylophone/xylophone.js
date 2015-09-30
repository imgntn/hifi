var XYLOHPONE_USER_DATA_KEY = 'hifi_xylophone';

var COLORS = [
	//red
	//orange
	//yellow
	//teal
	//green
	//lightblue
	//darkblue
	//purple

]

var MALLET_MODEL_URL = '';
var keyEntities = [];
var mallets = [];
var xylophoneBase;
//todo:  position the base in front of you facing you 
var baseStartPosition={};

function createMallets() {

	var properties = {
		type: 'Model',
		name:'hifi_Xylophone_mallet',
		modelURL: MALLET_MODEL_URL,
		dimensions: {
			x: 0.025,
			y: 0.315,
			z: 0.0254
		}
	}


	var firstMallet = Entities.addEntity(properties);
	var secondMalley = Entities.addEntity(properties);
	mallets.push(firstMallet);
	mallets.push(secondMallet);
}


function createXyloPhoneKeys() {
	keyInfo.forEach(function(xyloKey, index) {

		XYLOPHONE_SOUNDS.push(SoundCache.getSound(SOUND_BASE_URL + xyloKey[index].note + "_sound.wav"));
		var properties = {
			name: 'Xylophone Key' + xyloKey[index].note,
			dimensions: {
				x: 0.0508,
				y: 0.0254,
				z: xyloKey[index].keyLength
			},
			position:{
				//add key width plus a little bit to the spacing.
			}
			color: COLORS[index],
			collisionsWillMove: false,
			script: XYLOPHONE_KEY_SCRIPT

		}
		var xyloPhoneKey = Entities.addEntity(properties);
		keyEntities.push(xyloPhoneKey);
		setEntityCustomData(XYLOPHONE_USERDATA_KEY, xyloPhoneKey, xyloKey[index].note);



	})
}


var keyInfo = [{
	note: 'c1',
	keyLength: 0.3556,
}, {
	note: 'd1',
	keyLength: 0.3429,
}, {
	note: 'e1',
	keyLength: 0.3302,
}, {
	note: 'f1',
	keyLength: 0.3175,
}, {
	note: 'g1',
	keyLength: 0.3048,
}, {
	note: 'a1',
	keyLength: 0.2921,
}, {
	note: 'b1',
	keyLength: 0.2794,
}, {
	note: 'c2',
	keyLength: 0.2667,
}]

function createXylophoneBase (){
	var properties ={
		type:'model',
		modelURL:'',
		dimensions:{
			x:0,
			y:0,
			z:0,
		},
		collisionsWillMove:false,
		gravity:{
			x:0,
			y:-9.8,
			z:0
		}
		position: baseStartPosition,
		// rotation:
	}
var xylophoneBase = Entities.addEntity(properties);
}

function cleanup() {
	while (mallets.length > 0) {
		Entities.deleteEntity(mallets.pop());
	}
	while (keyEntities.length > 0) {
		Entities.deleteEntity(keyEntities.pop());
	}
}