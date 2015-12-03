//
//  tower_d.js
//
//  Created by James B. Pollack on 9/29/2015
//  Copyright 2015 High Fidelity, Inc.
//
// This is a game where you shoot a bow and arrow to defend your tower from the horde.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

Script.include('creatureSteering.js');
var steer = loadSteer();

var EARTH_GRAVITY = {
	x: 0,
	y: -9.8,
	z: 0
};

var TOWER_START_LOCATION = {
	x: 0,
	y: 5,
	z: 0
};

var BOTTOM_OF_TOWER_TARGET = {
	x: 0,
	y: 0,
	z: 0
};

var TOP_OF_TOWER_TARGET = {
	x: 0,
	y: 18,
	z: 0
};

var CREATURE_RUNNING_ANIMATION_URL = 'http://hifi-content.s3.amazonaws.com/james/towerdefense/animations/running_inPlace.fbx';
var CREATURE_CLIMBING_ANIMATION_URL = 'http://hifi-content.s3.amazonaws.com/james/towerdefense/animations/climbing_up_wall_inPlace.fbx';
var CREATURE_DYING_ANIMATION_URL = 'http://hifi-content.s3.amazonaws.com/james/towerdefense/animations/standing_death_left_01.fbx';


var TOWER_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/towerdefense/models/complete_tower.fbx';
var TOWER_COLLISION_HULL = '';
var CREATURE_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/towerdefense/models/Beta.fbx';
var ROCK_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/towerdefense/models/rock.fbx';
var TREE_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/towerdefense/models/treetoon.fbx';
var FENCE_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/towerdefense/models/fence.fbx';

var TOWER_DIMENSIONS = {
	x: 5.63,
	y: 11.92,
	z: 6.66
};

var CREATURE_DIMENSIONS = {
	x: 1.94,
	y: 1.81,
	z: 0.31
};

var NUMBER_OF_SPAWNERS = 12;
var SPAWNER_RADIUS_X = 50;
var SPAWNER_RADIUS_Y = 50;

var SPAWN_CREATURE_INTERVAL = 500;
var MOVE_SEEKING_CREATURES_INTERVAL = 16;
var MOVE_CLIMBING_CREATURES_INTERVAL = 250;

var CREATURE_CLIMB_SPEED = 1;

var MIN_DISTANCE_FROM_BOTTOM = 5;
var MIN_DISTANCE_FROM_TOP = 2.5;

function App() {
	return this
}

App.prototype = {
	tower: null,
	ground: null,
	spawners: [],
	creatures: [],
	seekingCreatures: [],
	climbingCreatures: [],
	timers: [],
	moveClimbersInterval: null,
	moveSeekersInterval: null,
	spawnerInterval: null,
	obstaclesPrimitives: [{
		modelURL: TREE_MODEL_URL,
		dimensions: {
			x: 2.92,
			y: 6.76,
			z: 5.7
		}
	}, {
		modelURL: ROCK_MODEL_URL,
		dimensions: {
			x: 2,
			y: 2,
			z: 2
		}
	}, {
		modelURL: FENCE_MODEL_URL,
		dimensions: {
			x: 2.37,
			y: 0.61,
			z: 0.07
		}
	}],
	moveCreatureTowardTarget: function(creature, target) {
		print('target::',JSON.stringify(target))
		//move toward the tower but avoid obstacles
		var seek = steer.arrive(creature, target);
		var avoidObstacles = steer.fleeObstacles(creature);
		var j;
		var averageAvoiderFlight;

		for (j = 0; j < avoidObstacles.length; j++) {
			if (j === 0) {
				averageAvoiderFlight = avoidObstacles[0];
			} else {
				averageAvoiderFlight = Vec3.sum(avoidObstacles[j - 1], avoidObstacles[j])
			}
		};

		averageAvoiderFlight = Vec3.multiply(averageAvoiderFlight, 1 / avoidObstacles.length);

		var average = Vec3.sum(seek, averageAvoiderFlight);
		average = Vec3.multiply(average, 1 / 2);

		//constrain movement up/down
       var thisCreatureProps = Entities.getEntityProperties(creature, ["position", "rotation"]);

   
      //  var constrainedRotation = Quat.fromVec3Degrees(eulerAngle);

        //  print('CR:::'+JSON.stringify(constrainedRotation))

        var creaturePosition = thisCreatureProps.position;
        var creatureToTarget = Vec3.subtract(target, creaturePosition);
        var creatureRotation = Quat.rotationBetween(Vec3.UNIT_Z, creatureToTarget);
        print('CR::' + JSON.stringify(creatureRotation));


 
        // var eulerAngle = Quat.safeEulerAngles(creatureRotation);
        // eulerAngle.x = 0;
        // eulerAngle.z = 0;
        // var constrainedRotation = Quat.fromVec3Degrees(eulerAngle)


		Entities.editEntity(creature, {
			rotation:creatureRotation,
			velocity: {
				x: average.x,
				y: 0,
				z: average.z
			}
		});
	},
	moveCreatureUpWall: function(creature) {
		var position =
			testDistanceFromTarget()
		Entities.editEntity(creature, {
			velocity: {
				x: 0,
				y: 1,
				z: 0
			}
		});
	},
	moveSeekers: function() {
		var _t = App;
		_t.seekingCreatures.forEach(function(creature) {
			var position = Entities.getEntityProperties(creature, "position").position;
			var howFarFromBottom = _t.testDistanceFromTarget(position, BOTTOM_OF_TOWER_TARGET);
			print('HOW FAR FROM BOTTOM:::' + howFarFromBottom)
			if (howFarFromBottom < MIN_DISTANCE_FROM_BOTTOM) {
				Entities.deleteEntity(creature);
				//_t.creatureReachedBottomOfTower(creature);
			} else {
				_t.moveCreatureTowardTarget(creature, BOTTOM_OF_TOWER_TARGET);
			}
		})
	},
	moveClimbers: function() {
		this.climbingCreatures.forEach(function(creature) {
			var howFarFromTop = this.testDistanceFromTarget(position, TOP_OF_TOWER_TARGET);
			if (howFarFromTop < MIN_DISTANCE_FROM_TOP) {
				this.creatureReachedBottomOfTower(creature);
			} else {
				moveCreatureUpWall(creature);

			}

		})
	},
	removeCreatureFromSeekers: function(creature) {
		var index = this.seekingCreatures.indexOf(creature);

		if (index > -1) {
			this.seekingCreatures.splice(index, 1);
		}
	},
	removeSeekerFromClimbers: function() {
		var index = this.climbingCreatures.indexOf(creature);

		if (index > -1) {
			this.climbingCreatures.splice(index, 1);
		}
	},
	testDistanceFromTarget: function(position, target) {
		var positionToTarget = Vec3.subtract(target, position);
		var length = Vec3.length(positionToTarget);
		return length
	},
	switchCreatureFromSeekerToClimber: function(creature) {
		removeCreatureFromSeekers(creature);
		this.climbingCreatures.push(creature);
		this.playCreatureClimbingAnimation(creature);
	},
	creatureReachedTopOfTower: function(creature) {
		removeSeekerFromClimbers(creature);
		Entities.deleteEntity(creature);
	},
	creatureReachedBottomOfTower: function(creature) {
		this.switchCreatureFromSeekerToClimber(creature);
	},
	setupScene: function() {
		this.ground = this.createGround();
		this.tower = this.createTower(TOWER_START_LOCATION);
		this.distribute(NUMBER_OF_SPAWNERS, SPAWNER_RADIUS_X, SPAWNER_RADIUS_Y);
	},
	createSpawnerInterval: function() {
		print('creating spawner interval')
		this.spawnerInterval = Script.setInterval(App.spawnCreatureAtRandomSpawner, SPAWN_CREATURE_INTERVAL);
		this.timers.push(this.spawnerInterval);
	},
	spawnCreatureAtRandomSpawner: function() {
		//pick a spawner position
		var _t = App;
		print('this spawners' + _t.spawners.length)
		var spawner = _t.spawners[Math.floor(Math.random() * _t.spawners.length)];
		var spawnerProperties = Entities.getEntityProperties(spawner, "position");
		var creature = _t.createCreature(spawnerProperties.position);
		_t.seekingCreatures.push(creature);
		_t.playCreatureRunningAnimation(creature);

	},
	createGround: function(position) {

		var groundModelURL = "https://hifi-public.s3.amazonaws.com/alan/Playa/Ground.fbx";
		var groundPosition = {
			x: BOTTOM_OF_TOWER_TARGET.x,
			y: BOTTOM_OF_TOWER_TARGET.y - 2,
			z: BOTTOM_OF_TOWER_TARGET.z
		};

		var ground = {
			type: "Model",
			modelURL: groundModelURL,
			shapeType: "box",
			position: groundPosition,
			collisionsWillMove: false,
			dimensions: {
				x: 900,
				y: 0.82,
				z: 900
			},
			userData: JSON.stringify({
				grabbableKey: {
					grabbable: false
				}
			})
		}

		this.ground = Entities.addEntity(ground);
		// Script.addEventHandler(ground, "collisionWithEntity", entityCollisionWithGround);



		return Entities.addEntity(ground);
	},
	createTower: function(position) {
		var tower = {
			type: 'Model',
			shapeType: 'compound',
			modelURL: TOWER_MODEL_URL,
			compoundShapeURL: TOWER_COLLISION_HULL,
			collisionsWillMove: false,
			ignoreForCollisions: false,
			visible: true,
			dimensions: TOWER_DIMENSIONS,
			position: position,
			name: 'Hifi-Tower'

		};
		return Entities.addEntity(tower);
	},
	createSpawner: function(position) {
		var spawner = {
			type: 'Box',
			collisionsWillMove: false,
			ignoreForCollisions: true,
			visible: true,
			dimensions: {
				x: 1,
				y: 1,
				z: 1
			},
			position: position,
			name: 'Hifi-Creature-Spawner',
			color: {
				red: 255,
				green: 0,
				blue: 0
			}
		}
		return Entities.addEntity(spawner);;
	},
	createCreature: function(position) {
		var creature = {
			type: 'Model',
			modelURL: CREATURE_MODEL_URL,
			shapeType: 'box',
			dimensions: CREATURE_DIMENSIONS,
			position: position,
			collisionsWillMove: false,
			// restitution:0,
			gravity: EARTH_GRAVITY,
			ignoreForCollisions: false,
			userData: JSON.stringify({
				grabbableKey: {
					grabbable: false
				}
			}),
			//rotation:Quat.fromPitchYawRollDegrees(0,-90,0)
		};
		return Entities.addEntity(creature);
	},
	playCreatureRunningAnimation: function(creature) {
		var animationSettings = JSON.stringify({
			running: true
		});
		Entities.editEntity(creature, {
			// animationURL: CREATURE_RUNNING_ANIMATION_URL,
			animation: {
				url: CREATURE_RUNNING_ANIMATION_URL,
				running: true,
				fps: 30
			},
		});

	},
	playCreatureClimbingAnimation: function(creature) {
		var animationSettings = JSON.stringify({
			running: true
		});
		Entities.editEntity(creature, {
			animationURL: CREATURE_CLIMBING_ANIMATION_URL,
			animation: {
				url: CREATURE_CLIMBING_ANIMATION_URL,
				running: true,
				fps: 30
			},
		});

	},
	playCreatureDyingAnimation: function(creature) {
		var animationSettings = JSON.stringify({
			running: true
		});
		Entities.editEntity(creature, {
			animationURL: CREATURE_DYING_ANIMATION_URL,
			animation: {
				url: CREATURE_DYING_ANIMATION_URL,
				running: true,
				fps: 30
			},
		});

	},
	createBow: function(position) {
		var SCRIPT_URL = Script.resolvePath('../../../toybox/bow/bow.js');

		var MODEL_URL = "https://hifi-public.s3.amazonaws.com/models/bow/new/bow-deadly.fbx";
		var COLLISION_HULL_URL = "https://hifi-public.s3.amazonaws.com/models/bow/new/bow_collision_hull.obj";
		var BOW_DIMENSIONS = {
			x: 0.04,
			y: 1.3,
			z: 0.21
		};

		var BOW_GRAVITY = {
			x: 0,
			y: 0,
			z: 0
		}


		var bow = Entities.addEntity({
			name: 'Hifi-Bow',
			type: "Model",
			modelURL: MODEL_URL,
			position: Vec3.sum({
				x: 0,
				y: 12,
				z: 0.5
			}, TOWER_START_LOCATION),
			dimensions: BOW_DIMENSIONS,
			collisionsWillMove: true,
			gravity: BOW_GRAVITY,
			shapeType: 'compound',
			compoundShapeURL: COLLISION_HULL_URL,
			script: SCRIPT_URL,
			userData: JSON.stringify({
				grabbableKey: {
					invertSolidWhileHeld: true,
					spatialKey: {
						relativePosition: {
							x: 0,
							y: 0.06,
							z: 0.11
						},
						relativeRotation: Quat.fromPitchYawRollDegrees(0, -90, 90)
					}
				}
			})
		});

	},
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	createObstacle: function() {
		var obstacle = this.obstaclesPrimitives[Math.floor(Math.random() * this.obstaclesPrimitives.length)];
		var obstacleProperties = {
			name: 'Hifi-Tower-Obstacle',
			shapeType: 'box',
			collisionsWillMove: false,
			ignoreForCollisions: false,
			dimensions: obstacle.dimensions,
			type: 'model',
			modelURL: obstacle.modelURL,
			position: {
				x: TOWER_START_LOCATION.x + this.getRandomInt(-100, 100),
				y: 0,
				z: TOWER_START_LOCATION.z + this.getRandomInt(-100, 100)
			}

		};
		Entities.addEntity(obstacleProperties);
	},
	distribute: function(_numberOfPoints, radiusX, radiusY) {

		var IS_VERTICAL = false;

		var centrePos = TOWER_START_LOCATION;

		for (var pointNum = 0; pointNum < _numberOfPoints; pointNum++) {
			// "i" now represents the progress around the circle from 0-1
			// we multiply by 1.0 to ensure we get a fraction as a result.
			var i = (pointNum * 1.0) / _numberOfPoints;

			// get the angle for this step (in radians, not degrees)
			var angle = i * Math.PI * 2;

			// the X &amp; Y position for this angle are calculated using Sin &amp; Cos
			var x = Math.sin(angle) * radiusX;
			var y = Math.cos(angle) * radiusY;


			if (IS_VERTICAL) {
				var pos = {
					x: x + centrePos.x,
					y: y + centrePos.y,
					z: 0 + centrePos.z
				}

			} else {

				var pos = {
					x: x + centrePos.x,
					y: 0 + centrePos.z,
					z: y + centrePos.y
				}
			}

			print('CREATE SPAWNER AT:' + pos.x + "/" + pos.y + "/" + pos.z);

			this.spawners.push(this.createSpawner(pos));
		}

	},
	createMoveSeekersInterval: function() {
		this.moveSeekersInterval = Script.setInterval(App.moveSeekers, MOVE_SEEKING_CREATURES_INTERVAL);
		this.timers.push(this.moveSeekersInterval);
	},
	createMoveClimbersInteval: function() {
		this.moveClimbersInterval = Script.setInterval(App.moveClimbers, MOVE_CLIMBING_CREATURES_INTERVAL);
		this.timers.push(this.moveClimbersInterval);
	},
	begin: function() {
		this.createSpawnerInterval();
		this.createMoveSeekersInterval();
		//this.createMoveClimbersInteval();
	}

}

cleanupTimers = function() {
	print('CLEANUP TIMERS')
	while (App.timers.length > 0) {
		Script.clearInterval(App.timers.pop())
	}
};
cleanupCreatures = function() {
	print('CLEANUP CREATURES')
	while (App.seekingCreatures.length > 0) {
		Entities.deleteEntity(App.seekingCreatures.pop());
	}
	while (App.climbingCreatures.length > 0) {
		Entities.deleteEntity(App.climbingCreatures.pop());
	}
};
cleanupScenery = function() {
	print('CLEANUP SCENERY')
	Entities.deleteEntity(App.tower);
	Entities.deleteEntity(App.ground);
	while (App.spawners.length > 0) {
		Entities.deleteEntity(App.spawners.pop());
	}
};

var App = new App();

Script.scriptEnding.connect(cleanupTimers);
Script.scriptEnding.connect(cleanupCreatures);
Script.scriptEnding.connect(cleanupScenery);
App.setupScene();
App.begin();