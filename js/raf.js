

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    'use strict';
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }

    // for IE
    if (!window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;

        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 20, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };

        window.cancelAnimationFrame = clearTimeout;
    }
}());


