var gameSize = {width: window.innerWidth - 4, height: window.innerHeight - 4};
var renderer = PIXI.autoDetectRenderer(gameSize.width, gameSize.height, {antialias: true});
document.body.appendChild(renderer.view);
var textures = PIXI.utils.TextureCache;

var stage = new PIXI.Container();
var lastTime = Date.now();
var mousePos = {x: 0, y: 0};
var mouseGamePos = {x: 0, y: 0};
var selectedTile;

// Size of an edge of a hex tile
var hexSize = 128;

// Current game state
var state = gameState;

PIXI.loader
	.add('structure_sheet', 'data/images/structure_sheet.json')
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
	generateHexMap(6);

	selectedTile = new PIXI.Sprite(textures['selection.png']);
	selectedTile.anchor.set(0.5, 0.5);
	stage.addChild(selectedTile);

	stage.interactive = true;
	stage.mousemove = handleMouseMove;
}

function createHex(pos, textureName) {
	// Create a hex tile sprite
	var sprite = new PIXI.Sprite(textures[textureName]);
	sprite.position.x = pos.x;
	sprite.position.y = pos.y;
	sprite.anchor.set(0.5, 0.5);
	stage.addChild(sprite);
}

function generateHexMap(mapSize) {
	// Setup a hex map in the shape of a large hex
	var mapEnd = mapSize - 1;
	var yMin = 0;
	var yMax = mapEnd;
	for (var x = -mapEnd; x <= mapEnd; ++x) {
		for (var y = yMin; y <= yMax; ++y) {
			// Calculate coordinates and add tile
			var pos = hexToPixel({x: x, y: y}, hexSize);
			createHex(pos, 'empty.png');
			if (x == 0) {
				createHex(pos, 'structure.png');
			}
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

	updateMouseGamePos();

	console.log(stage.scale);

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
			// Pan based on which key(s) were pressed
			var delta = arrowMappings[arrowKey];
			for (var key in delta) {
				stage[key] += delta[key] * dt * 600;
			}

			updateMouseGamePos();
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

function handleMouseMove(event) {
	mousePos = {
		x: event.data.originalEvent.clientX,
		y: event.data.originalEvent.clientY
	};

	// console.log(event.data);

	updateMouseGamePos();
}

function updateMouseGamePos() {
	mouseGamePos.x = (mousePos.x - stage.x) / stage.scale.x;
	mouseGamePos.y = (mousePos.y - stage.y) / stage.scale.y;

	var pos = hexToPixel(pixelToHex(mouseGamePos, hexSize), hexSize);
	selectedTile.position.x = pos.x;
	selectedTile.position.y = pos.y;
}
