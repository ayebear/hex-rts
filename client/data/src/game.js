var gameSize = {width: window.innerWidth - 4, height: window.innerHeight - 4};
var renderer = PIXI.autoDetectRenderer(gameSize.width, gameSize.height, {antialias: true});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var lastTime = Date.now();

// Current game state
var state = gameState;

PIXI.loader
	.add('empty', 'data/images/empty.png')
	.add('structure', 'data/images/structure.png')
	.load(start);

function start() {
	setup();
	render();
}

function setup() {
	renderer.backgroundColor = 0x000000;

	/*
	This will create a bunch of entities with sprites to display the hex tiles.
	They can be accessed by entity ID, or by colliding with the sprite to get the sprite/entity ID.
	*/
	generateHexMap(4);
}

function hexToPixel(pos, size) {
	var x = size * 1.5 * pos.x;
	var y = size * Math.sqrt(3) * (pos.y + (pos.x / 2));
	return {x: x, y: y};
}

function pixelToHex(pos, size) {
	var x = (pos.x * (2 / 3)) / size
	var y = ((-pos.x / 3) + ((Math.sqrt(3) / 3) * pos.y)) / size
	return {x: Math.floor(x), y: Math.floor(y)};
}

function createHex(pos) {
	// Create a hex tile sprite
	var sprite = new PIXI.Sprite(PIXI.loader.resources['empty'].texture);
	sprite.position.x = pos.x;
	sprite.position.y = pos.y;
	stage.addChild(sprite);
}

function generateHexMap(mapSize) {
	// Size of an edge of a hex tile
	var hexSize = 128;

	// Setup a hex map in the shape of a large hex
	var mapEnd = mapSize - 1;
	var yMin = 0;
	var yMax = mapEnd;
	for (var x = -mapEnd; x <= mapEnd; ++x) {
		for (var y = yMin; y <= yMax; ++y) {
			// Calculate coordinates and add tile
			var pos = hexToPixel({x: x, y: y}, hexSize);
			createHex(pos);
		}
		if (x < 0) {
			--yMin;
		} else {
			--yMax;
		}
	}
}

function mapZoom(stage, gameSize, offset) {
	/*console.log(stage);

	var halfSize = {
		x: gameSize.width / 2.0,
		y: gameSize.height / 2.0
	};

	// Get current center of view
	var center = {
		x: stage.x - halfSize.x,
		y: stage.y - halfSize.y
	};*/

	// Scale the container
	stage.scale.x *= offset;
	stage.scale.y *= offset;

	// Move to previous center
	/*stage.x = center.x + halfSize.x;
	stage.y = center.y + halfSize.y;*/
}




// Used for panning
var arrowMappings = {
	'37': {x: 1, y: 0},
	'39': {x: -1, y: 0},
	'38': {x: 0, y: 1},
	'40': {x: 0, y: -1}
};

function gameState(dt) {

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

function render() {
	// Calculate delta-time
	var currentTime = Date.now();
	var dt = (currentTime - lastTime) / 1000.0;
	lastTime = currentTime;

	state(dt);

	renderer.render(stage);

	requestAnimationFrame(render);
}
