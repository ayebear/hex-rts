/*
Source code derived from:
http://www.redblobgames.com/grids/hexagons/
*/

// Convert axial hex coordinates to pixel coordinates
function hexToPixel(pos, size) {
	var x = size * 1.5 * pos.x;
	var y = size * Math.sqrt(3) * (pos.y + (pos.x / 2));
	return {x: x, y: y};
}

// Convert pixel coordinates to axial hex coordinates
function pixelToHex(pos, size) {
	var x = (pos.x * (2 / 3)) / size;
	var y = ((-pos.x / 3) + ((Math.sqrt(3) / 3) * pos.y)) / size;
	return hexRound({x: x, y: y});
}

function cubeToHex(cubePos) {
	return {
		x: cubePos.x,
		y: cubePos.z
	};
}

function hexToCube(hexPos) {
	var x = hexPos.x;
	var z = hexPos.y;
	var y = -x - z;
	return {
		x: x,
		y: y,
		z: z
	};
}

function cubeRound(hexPos) {
	var rx = Math.round(hexPos.x);
	var ry = Math.round(hexPos.y);
	var rz = Math.round(hexPos.z);

	var xDiff = Math.abs(rx - hexPos.x);
	var yDiff = Math.abs(ry - hexPos.y);
	var zDiff = Math.abs(rz - hexPos.z);

	if (xDiff > yDiff && xDiff > zDiff) {
		rx = -ry - rz;
	} else if (yDiff > zDiff) {
		ry = -rx - rz;
	} else {
		rz = -rx - ry;
	}

	return {
		x: rx,
		y: ry,
		z: rz
	};
}

function hexRound(pos) {
	return cubeToHex(cubeRound(hexToCube(pos)));
}
