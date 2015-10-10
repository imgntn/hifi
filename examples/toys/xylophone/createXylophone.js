var SOUND_BASE_URL = 'http://hifi-public.s3.amazonaws.com/sounds/Xylophone/';
var XYLOPHONE_MODEL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/xylophone.fbx';
var MALLET_MODEL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/mallet.fbx';
var MALLET_COLLISION_HULL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/mallet_collision_hull.obj';
var XYLOPHONE_KEY_SCRIPT_URL = Script.resolvePath('xylophoneKey.js');

var xylophoneSounds = [];

var keyEntities = [];
var KEY_SPACING = {
	x: 0.16,
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
var baseStartPosition = {
	x: 546.10,
	y: 495.34,
	z: 506.50
};

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
	note: 'D2',
	keyLength: 0.3429,
}, {
	note: 'E2',
	keyLength: 0.3302,
}, {
	note: 'F2',
	keyLength: 0.3175,
}, {
	note: 'G2', 
	keyLength: 0.3048,
}, {
	note: 'A2',
	keyLength: 0.2921,
}, {
	note: 'B2',
	keyLength: 0.2794,
}, {
	note: 'C3',
	keyLength: 0.2667,
}];

function createXylophoneKeys() {

	var rotation = Quat.fromPitchYawRollDegrees(0, -56, 0);

	keyInfo.forEach(function(xyloKey, index) {
		//var position = Vec3.sum(baseStartPosition, Vec3.multiply(index, KEY_SPACING));

		var vHat = Quat.getRight(rotation);
		var spacer = 0.16 * index;
		var multiplier = Vec3.multiply(spacer, vHat);
		var position = Vec3.sum(baseStartPosition, multiplier);

		var properties = {
			type: 'Box',
			shapeType: 'Box',
			name: 'Xylophone Key ' + xyloKey.note,
			script: XYLOPHONE_KEY_SCRIPT_URL,
			dimensions: {
				x: 0.1008,
				y: 0.0454,
				z: xyloKey.keyLength * 2
			},
			position: position,
			rotation: rotation,
			color: {
				red: 0,
				green: 0,
				blue: 255
			},
			restitution: 1,
			collisionsWillMove: false,
			gravity: {
				x: 0,
				y: -9.8,
				z: 0
			},
			linearDamping: 1,
			angularDamping: 1,
			userData: JSON.stringify({
				resetMe: {
					resetMe: true
				},
				grabbableKey: {
					grabbable: false
				},
				soundKey: {
					soundURL: SOUND_BASE_URL + xyloKey.note + ".L.wav"
				}
			})
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
		restitution: 1,
		collisionsWillMove: true,
		position: baseStartPosition,
		shapeType: 'compound',
		compoundShapeURL: MALLET_COLLISION_HULL_URL,
		userData: JSON.stringify({
			resetMe: {
				resetMe: true
			},
			grabbableKey: {
				invertSolidWhileHeld: true
			}
		})
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

	Entities.deleteEntity(xylophoneBase);
}

Script.scriptEnding.connect(cleanup);
// createXylophoneBase();
createMallets();
createXylophoneKeys();