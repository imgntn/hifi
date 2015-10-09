var SOUND_BASE_URL = 'http://hifi-public.s3.amazonaws.com/sounds/Xylophone/Xyl_';
var XYLOPHONE_MODEL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/xylophone.fbx';
var MALLET_MODEL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/mallet.fbx';
var MALLET_COLLISION_HULL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/mallet_collision_hull.obj';
var xylophoneSounds = [];
var keyEntities = [];
var KEY_SPACING = {
	x: 0.08,
	y: 0,
	z: 0
};

var mallets = [];
var xylophoneBase;

//load the xylpophone base model
//make keys
//make mallets
var center = Vec3.sum(Vec3.sum(MyAvatar.position, {
	x: 0,
	y: 0.5,
	z: 0
}), Vec3.multiply(1, Quat.getFront(Camera.getOrientation())));
var baseStartPosition = {}
var baseStartPosition = center;

function createXylophoneBase() {
	var properties = {
		type: 'Model',
		modelURL: XYLOPHONE_MODEL_URL,
		dimensions: {
			x: 0.64,
			y: 0.09,
			z: 0.34,
		},
		collisionsWillMove: false,
		gravity: {
			x: 0,
			y: -9.8,
			z: 0
		},
		position: baseStartPosition,
	}

	xylophoneBase = Entities.addEntity(properties);
}

var keyInfo = [{
	note: 'C2',
	keyLength: 0.3556,
}, {
	note: 'CSharp2',
	keyLength: 0.3429,
}, {
	note: 'D2',
	keyLength: 0.3302,
}, {
	note: 'DSharp2',
	keyLength: 0.3175,
}, {
	note: 'DSharp2', // should be e
	keyLength: 0.3048,
}, {
	note: 'F2',
	keyLength: 0.2921,
}, {
	note: 'FSharp2',
	keyLength: 0.2794,
}, {
	note: 'G2',
	keyLength: 0.2667,
}]


function createXyloPhoneKeys() {
	keyInfo.forEach(function(xyloKey, index) {
		var position = Vec3.sum(baseStartPosition, Vec3.multiply(index, KEY_SPACING));
		print('INDEX::: ' + index);
		print('POSITION:::' + JSON.stringify(position))
		var properties = {
			type: 'Box',
			shapeType: 'Box',
			name: 'Xylophone Key ' + xyloKey.note,
			dimensions: {
				x: 0.0508,
				y: 0.0254,
				z: xyloKey.keyLength
			},
			position: position,
			color: {
				red: 0,
				green: 0,
				blue: 255
			},
			restitution: 0.1,
			collisionsWillMove: false,
			collisionSoundURL: SOUND_BASE_URL + xyloKey.note + ".L.wav"
		};

		//print('PROPS::'+JSON.stringify(properties))

		var xyloPhoneKey = Entities.addEntity(properties);
		keyEntities.push(xyloPhoneKey);

	})
}

function createMallets() {

	var properties = {
		type: 'Model',
		name: 'Xylophone Mallet',
		modelURL: MALLET_MODEL_URL,
		dimensions: {
			x: 0.46,
			y: 0.04,
			z: 0.04
		},
		restitution: 0.1,
		collisionsWillMove: true,
		position: baseStartPosition,
		shapeType: 'compound',
		compoundShapeURL: MALLET_COLLISION_HULL_URL
	}

	var firstMallet = Entities.addEntity(properties);
	// var secondMallet = Entities.addEntity(properties);
	mallets.push(firstMallet);
	//	mallets.push(secondMallet);
}

function cleanup() {
	while (mallets.length > 0) {
		Entities.deleteEntity(mallets.pop());
	}
	while (keyEntities.length > 0) {
		Entities.deleteEntity(keyEntities.pop());
	}

	Entities.deleteEntity(xylophoneBase)
}

Script.scriptEnding.connect(cleanup);
// createXylophoneBase();
createMallets();
createXyloPhoneKeys();