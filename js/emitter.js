/**
 * 简单的发布订阅功能
 */
function SimpleEventEmitter() {
    this.callbacks = {};
}

SimpleEventEmitter.prototype = {
    constructor: SimpleEventEmitter,

    on: function(eventName, callback) {
        if (typeof callback !== 'function') return;
        (this.callbacks[eventName] = this.callbacks[eventName] || []).push(callback);
        return this;
    },

    off: function(eventName, callback) {
        var eventQueue = this.callbacks[eventName];

        if (!eventQueue) {
            return this;
        }

        if (!callback) {
            this.callbacks[eventName] = null;
            return this;
        }

        var len = eventQueue.length;

        for (var i = 0; i < len; i++) {
            if (eventQueue[i] === callback) {
                eventQueue.splice(i, 1);
            }
        }
        
        return this;
    },

    fire: function(eventName) {
        var eventQueue = this.callbacks[eventName];
        var len = eventQueue && eventQueue.length;

        if (!len) {
            return this;
        }

        var args = [].slice.call(arguments, 1);

        for (var i = 0; i < len; i++) {
            eventQueue[i].apply(null, args);
        }

        return this;
    }
};

module.exports = SimpleEventEmitter;
