var Hex = require("./hex.js");

module.exports = HexMap;

/*
Creates a hexagon tile-map using pixi.js sprites.
*/
function HexMap(stage, tileSize) {

	// Tiles are stored here
	// tiles[key].sprite
	this.tiles = {};

	this.tileSize = tileSize;
	this.root = new PIXI.Container();
	stage.addChild(this.root);
	this.layer = new PIXI.Container();
	this.root.addChild(this.layer);
}

HexMap.prototype.createBackground = function(mapSize) {
	// Setup a hex map in the shape of a large hex
	var mapEnd = mapSize - 1;
	var yMin = 0;
	var yMax = mapEnd;
	var bgTiles = new PIXI.Container();
	this.root.addChild(bgTiles);
	for (var x = -mapEnd; x <= mapEnd; ++x) {
		for (var y = yMin; y <= yMax; ++y) {
			// Calculate coordinates and add tile
			var pos = {x: x, y: y, z: -10};
			this.set(pos, 'empty.png');
		}
		if (x < 0) {
			--yMin;
		} else {
			--yMax;
		}
	}
}

// Private method to add a new tile
HexMap.prototype.create = function(pos, key, textureName) {
	var tilePos = Hex.hexToPixel(pos, this.tileSize);

	// Create a hex tile sprite
	var sprite = new PIXI.Sprite(this.getTexture(textureName));
	sprite.position.x = tilePos.x;
	sprite.position.y = tilePos.y;
	sprite.anchor.set(0.5, 0.5);
	this.layer.addChild(sprite);
	this.tiles[key] = {sprite: sprite};
}

// Private method to update a tile's texture
HexMap.prototype.update = function(key, textureName) {
	this.tiles[key].sprite.texture = this.getTexture(textureName);
}

// Public method to add/update a tile
HexMap.prototype.set = function(pos, textureName) {
	var key = this.hash(pos);
	if (key in this.tiles) {
		this.update(key, textureName);
	} else {
		this.create(pos, key, textureName);
	}
}

// Takes a position with x, y, and z for the "z-index"
HexMap.prototype.hash = function(pos) {
	if (!('z' in pos)) {
		pos.z = 0;
	}
	return pos.x.toString() + ',' + pos.y.toString() + ',' + pos.z.toString();
}

HexMap.prototype.getTexture = function(name) {
	return PIXI.utils.TextureCache[name];
}
