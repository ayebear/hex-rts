var gameSize = {width: window.innerWidth - 4, height: window.innerHeight - 4};
var renderer = PIXI.autoDetectRenderer(gameSize.width, gameSize.height, {antialias: true});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var lastTime = Date.now();

var arrowMappings = {
	'37': {x: 1, y: 0},
	'39': {x: -1, y: 0},
	'38': {x: 0, y: 1},
	'40': {x: 0, y: -1}
};

var watchKeys = ['left', 'right', 'up', 'down', 'i', 'o'];
var keyDown = {};

PIXI.loader
	.add('empty', 'data/images/empty.png')
	.add('structure', 'data/images/structure.png')
	.load(start);

function start() {
	var state = setup();
	render(state);
}

function setup() {
	renderer.backgroundColor = 0x000000;

	// Setup hex map
	var mapSize = 128;
	for (var y = 0; y < mapSize; ++y) {
		for (var x = 0; x < mapSize; ++x) {
			var sprite = new PIXI.Sprite(PIXI.loader.resources['empty'].texture);
			sprite.position.x = x * 98;
			var offset = 0;
			if (x % 2 == 1) {
				offset = 55;
			}
			sprite.position.y = y * 112 + offset;
			stage.addChild(sprite);
		}
	}

	return {};
}

function mapZoom(stage, gameSize, offset) {
	console.log(stage);

	var halfSize = {
		x: gameSize.width / 2.0,
		y: gameSize.height / 2.0
	};

	// Get current center of view
	var center = {
		x: stage.x - halfSize.x,
		y: stage.y - halfSize.y
	};

	// Scale the container
	stage.scale.x *= offset;
	stage.scale.y *= offset;

	// Move to previous center
	stage.x = center.x + halfSize.x;
	stage.y = center.y + halfSize.y;
}

function update(state, dt) {

	// Camera panning
	for (var arrowKey in arrowMappings) {
		if (keyDown[arrowKey]) {
			var delta = arrowMappings[arrowKey];
			for (var key in delta) {
				stage[key] += delta[key] * dt * 600;
			}
		}
	}

	// Camera zooming
	if (keyDown['73']) {
		// Zoom in
		var offset = 1.0 + dt;
		mapZoom(stage, gameSize, offset);
	}
	if (keyDown['79']) {
		// Zoom out
		var offset = 1.0 / (1.0 + dt);
		mapZoom(stage, gameSize, offset);
	}

}

function render(state) {
	// Calculate delta-time
	var currentTime = Date.now();
	var dt = (currentTime - lastTime) / 1000.0;
	lastTime = currentTime;

	update(state, dt);

	renderer.render(stage);

	requestAnimationFrame(render);
}






// Controls

Mousetrap.bind(watchKeys, function(e) {
	keyDown[e.keyCode] = true;
}, 'keydown');

Mousetrap.bind(watchKeys, function(e) {
	keyDown[e.keyCode] = false;
}, 'keyup');
