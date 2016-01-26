/*
Creates a hexagon tile-map using pixi.js sprites.
*/
function HexMap(stage, tileSize) {

	// Tiles are stored here
	// tiles[key].sprite
	this.tiles = {};

	this.stage = stage;
	this.tileSize = tileSize;
}

HexMap.prototype.createBackground = function(mapSize) {
	// Setup a hex map in the shape of a large hex
	var mapEnd = mapSize - 1;
	var yMin = 0;
	var yMax = mapEnd;
	for (var x = -mapEnd; x <= mapEnd; ++x) {
		for (var y = yMin; y <= yMax; ++y) {
			// Calculate coordinates and add tile
			this.createTile({x: x, y: y}, 'empty.png');
			if (x == 0 && y == 0) {
				this.createTile({x: x, y: y}, 'structure.png');
			}
		}
		if (x < 0) {
			--yMin;
		} else {
			--yMax;
		}
	}
}

HexMap.prototype.createTile = function(pos, textureName) {
	var tilePos = hexToPixel(pos, this.tileSize);

	// Create a hex tile sprite
	var sprite = new PIXI.Sprite(PIXI.utils.TextureCache[textureName]);
	sprite.position.x = tilePos.x;
	sprite.position.y = tilePos.y;
	sprite.anchor.set(0.5, 0.5);
	this.stage.addChild(sprite);
	this.tiles['bg' + getKey(pos)] = {sprite: sprite};
}

HexMap.prototype.set = function(pos, textureName) {
	this.tiles[getKey(pos)].sprite.texture = PIXI.utils.TextureCache[textureName];
}