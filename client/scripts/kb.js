var Mousetrap = require("mousetrap");

var keyDown = {};
var watchKeys = ['left', 'right', 'up', 'down', 'i', 'o'];

module.exports = {
	codeToKey: {},
	keyToCode: {},
	keyDown: keyDown,
	watchKeys: watchKeys
};

Mousetrap.bind(watchKeys, function(e) {
	keyDown[e.keyCode] = true;
}, 'keydown');

Mousetrap.bind(watchKeys, function(e) {
	keyDown[e.keyCode] = false;
}, 'keyup');
