// tower defense game w/bow

//put tower in center
//put spawners in ring around the tower
//spawn betas that walk / crawl (seek to tower)
//parent head collision detector and body collision detector capsules to beta
//increase spawn rate over time (and with number of players)
//once betas reach the tower they start climbing
//spawn one bow per player
//adjust the cooldown time mechanic
//when an arrow collides with a runner head, it is defeated
//when an arrow collides with a runner body, it slows to crawl
//when an arrow collides with a crawler body, it is defeated
//when an arrow collides with a climber, it is defeated
//change animation and collider location with 


Script.include('creatureSteering.js');
var steer = loadSteer();

var CREATURE_SCRIPT_URL = '';
var BOW_SCRIPT_URL = '';

var GROUND_START_LOCATION = {
	x: 0,
	y: 0,
	z: 0
};

var TOWER_START_LOCATION = {
	x: 0,
	y: 0,
	z: 0
};

var BOTTOM_OF_TOWER_TARGET = {
	x: 0,
	y: 0,
	z: 0
};

var TOP_OF_TOWER_TARGET {
	x: 0,
	y: 0,
	z: 0
};

var CREATURE_RUNNING_ANIMATION_URL = '';
var CREATURE_CLIMBING_ANIMATION_URL = '';
var CREATURE_CRAWLING_ANIMATION_URL = '';

var TOWER_MODEL_URL = '';
var CREATURE_MODEL_URL = '';
var BOW_MODEL_URL = '';

var TOWER_DIMENSIONS = {
	x: 0,
	y: 0,
	z: 0
};
var CREATURE_DIMENSIONS = {
	x: 0,
	y: 0,
	z: 0
};
var BOW_DIMENSIONS = {
	x: 0,
	y: 0,
	z: 0
};

var NUMBER_OF_SPAWNERS = 12;
var SPAWNER_RADIUS_X = 50;
var SPAWNER_RADIUS_y\ Y = 50;

var SPAWN_CREATURE_INTERVAL = 5000;
var MOVE_SEEKING_CREATURES_INTERVAL = 100;
var MOVE_CLIMBING_CREATURES_INTERVAL = 250;

var CREATURE_CLIMB_SPEED = 1;

App.prototype = {
	tower: null,
	ground: null,
	spawners: [],
	creatures: [],
	timers: [],
	moveCreatureTowardTarget: function(creature, target) {
		var seek = steer.arrive(creature, target);
		Entities.editEntity(creature, {
			velocity: seek
		});
	},
	moveCreatureUpWall: function(creature) {
		Entities.editEntity(creature, {
			velocity: {
				x: 0,
				y: 1,
				z: 0
			}
		});
	},
	setupScene: function() {
		this.ground = this.createGround(GROUND_START_LOCATION);
		this.tower = this.createTower(TOWER_START_LOCATION);
		this.distribute(NUMBER_OF_SPAWNERS, SPAWNER_RADIUS_X, SPAWNER_RADIUS_Y);
		this.createSpawnerInterval();
	},
	createSpawnerInterval: function() {
		this.spawnerInterval = Script.setInterval(App.createCreatureAtRandomSpawner, SPAWN_CREATURE_INTERVAL);
		this.timers.push(this.spawnerInterval);
	},
	spawnCreatureAtRandomSpawner: function() {
		//pick a spawner position
		var spawner = this.spawners[Math.floor(Math.random() * this.spawners.length)];
		var spawnerProperties = Entities.getEntityProperties(this.spawner, "position");
		this.createCreature(spawnerProperties.position);
	},
	createGround: function(position) {
		var ground;
		return Entities.addEntity(ground);
	},
	createTower: function(position) {
		var tower;
		return Entities.addEntity(tower);
	},
	createSpawner: function(position) {
		var spawner;
		return Entities.addEntity(spawner);;
	},
	createCreature: function(position) {
		var creature;
		return Entities.addEntity(creature);
	},
	createBow: function(position) {

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

			print('CREATE AT:' + pos.x + "/" + pos.y + "/" + pos.z);

			this.spawners.push(this.createSpawner(pos));

		}


	},
	cleanupTimers: function() {
		while (this.timers.length > 0) {
			Script.clearInterval(this.timers.pop())
		}
	},
	cleanupCreatures: function() {
		while (this.creatures.length > 0) {
			Entities.deleteEntity(this.creatures.pop());
		}
	}
}