var codeToKey = {};
var keyToCode = {};

var keyDown = {};

var watchKeys = ['left', 'right', 'up', 'down', 'i', 'o'];

Mousetrap.bind(watchKeys, function(e) {
	keyDown[e.keyCode] = true;
}, 'keydown');

Mousetrap.bind(watchKeys, function(e) {
	keyDown[e.keyCode] = false;
}, 'keyup');
