var PIXI = require("pixi.js");
var HexMap = require("./hexmap.js");
var Hex = require("./hex.js");
var KB = require("./kb.js");

var gameSize = {width: window.innerWidth - 4, height: window.innerHeight - 4};
var renderer = PIXI.autoDetectRenderer(gameSize.width, gameSize.height, {antialias: true});
document.body.appendChild(renderer.view);
var textures = PIXI.utils.TextureCache;

var stage = new PIXI.Container();
var lastTime = Date.now();
var mousePos = {x: 0, y: 0};
var mouseGamePos = {x: 0, y: 0};
var selectedTile;
var panSpeed = 600;
var tileSize = 128;

// Current game state
var state = gameState;

var hexMap = new HexMap(stage, tileSize);

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
	hexMap.createBackground(6);

	selectedTile = new PIXI.Sprite(textures['selection.png']);
	selectedTile.anchor.set(0.5, 0.5);
	stage.addChild(selectedTile);

	stage.interactive = true;
	stage.mousemove = handleMouseMove;
	stage.mousedown = handleMouseDown;

	// Center the camera
	// Note: In the future this will center on the player, which will be the starting structure position
	centerStage(stage, {x: 0, y: 0});
}

function centerStage(stage, pos) {
	var tilePos = Hex.hexToPixel(pos, tileSize);
	stage.x = tilePos.x + (gameSize.width / 2);
	stage.y = tilePos.y + (gameSize.height / 2);
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

	// console.log(stage.scale);

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
		if (KB.keyDown[arrowKey]) {
			// Pan based on which key(s) were pressed
			var delta = arrowMappings[arrowKey];
			for (var key in delta) {
				stage[key] += delta[key] * dt * panSpeed;
			}

			updateMouseGamePos();
		}
	}

	// Camera zooming
	if (KB.keyDown['73']) {
		// Zoom in
		var offset = 1.0 + dt;
		mapZoom(stage, gameSize, offset);
	}
	if (KB.keyDown['79']) {
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

function windowToGameCoords(pos) {
	return {
		x: ((pos.x - stage.x) / stage.scale.x),
		y: ((pos.y - stage.y) / stage.scale.y)
	};
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
	mouseGamePos = windowToGameCoords(mousePos);

	var pos = Hex.hexToPixel(Hex.pixelToHex(mouseGamePos, hexMap.tileSize), hexMap.tileSize);
	selectedTile.position.x = pos.x;
	selectedTile.position.y = pos.y;
}

function handleMouseDown(event) {
	var pos = {
		x: event.data.originalEvent.clientX,
		y: event.data.originalEvent.clientY
	};
	handleMouseClick(pos);
}

function handleContextMenu(event) {
	var pos = {
		x: event.clientX,
		y: event.clientY
	};
	handleMouseClick(pos);
}

function handleMouseClick(pos) {
	var gamePos = windowToGameCoords(pos);
	var hexPos = Hex.pixelToHex(mouseGamePos, hexMap.tileSize);

	hexPos.z = 10;
	hexMap.set(hexPos, 'structure.png');

	console.log(hexPos);
}

