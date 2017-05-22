var RESOURCE = require('../config');
var loadCSS = require('./loadCSS');
var cssText = require('../css/styles.css');
loadCSS(cssText.replace(/__sprite/g, RESOURCE.sprite));

var $template = $(require('../html/player.html'));
var swfobject = require('./swfobject');
var timers = require('./timers');
var EMITTER = $({});

var rDOMEvents = /^on(blur|focus|focusin|focusout|load|resize|scroll|unload|click|dblclick|mousedown|mouseup|mousemove|mouseover|mouseout|mouseenter|mouseleave|change|select|submit|keydown|keypress|keyup|error|contextmenu)\=/i;

//*******************************************************************************
var debugInfo = {};
/**
 * @constructor 
 * 
 * @param {String} selector  Wrap 节点
 * @param {Object} options 配置对象
 */
function SwfPlayer(selector, options) {
    options = $.extend({}, {
        swfUrl: RESOURCE.swf,
        loading: RESOURCE.loading,
        bgcolor: '#000',
        preload: false,
        loop: false,
        autoplay: false,
        muted: false,
        volume: 1,
        simulateFullScreen: true
    }, options);

    this.options = options;

    this.vid = this.getVID();
    debugInfo[this.vid] = this;
    this.readyCalls = [require('./ready')];

    var $container = $(selector);
    $container.empty();
    $template.clone().appendTo($container);
    this.$wrap = $container.find('.video-wrapper');
    this.$wrap.prepend('<div id="' + this.vid + '"></div>');

    this.clickUrl = $.trim(options.clickUrl || '');
    var clickTrack = options.clickUrlTrack || '';
    var playTrack = options.playTrack || '';
    this.clickUrlTrack = $.isFunction(clickTrack) ? clickTrack : $.trim(clickTrack).replace(rDOMEvents, '');
    this.playTrack = $.isFunction(playTrack) ? playTrack : $.trim(playTrack).replace(rDOMEvents, '');

    // poster
    if (options.poster) {
        this.$wrap.find('.vplayer-poster img').attr('src', options.poster);
    }

    // 添加 loading 动画
    this.$wrap.find('.vplayer-loading').attr('src', options.loading);
    this.createPlayer();
}

SwfPlayer.prototype = {
    constructor: SwfPlayer,
    /**
     * 对外暴露事件接口
     */
    on(eventName, fn) {
        var events = eventName.split(/\s+/);
        for (var i = 0, len = events.length; i < len; i++) {
            EMITTER.on.call(EMITTER, events[i] + '_' + this.vid, fn);
        }
        return this;
    },

    off(eventName, fn) {
        if (!eventName) {
            EMITTER.off();
        } else {
            var events = eventName.split(/\s+/);
            for (var i = 0, len = events.length; i < len; i++) {
                EMITTER.off.call(EMITTER, events[i] + '_' + this.vid, fn);
            }
        }
        return this;
    },

    /**
     * 生成 guid 
     */
    getVID() {
        return 'vjs_' + (+new Date());
    },

    /**
     * 利用 swfobject.js 生成 flash 播放的 DOM 节点
     */
    createPlayer() {
        this.mode = 'swf';
        this.$wrap.css('background-color', this.options.bgcolor);

        var flashvars = {
            autoplay: this.options.autoplay,
            preload: this.options.preload,
            loop: this.options.loop,
            volume: this.options.volume,
            muted: this.options.muted,
            allowFullScreen: true,
            wmode: 'transparent'
        };

        if (!this.options.isRTMP) {
            flashvars.src = this.options.src;
        }

        var params = {
            allowScriptAccess: 'always',
            bgcolor: this.options.bgcolor,
            allowFullScreen: true,
            wmode: 'transparent'
        };

        var attributes = {
            id: this.vid,
            name: this.vid
        };

        swfobject.embedSWF(
            this.options.swfUrl,
            this.vid,
            '100%',
            '100%',
            '10.3',
            '',
            flashvars,
            params,
            attributes
        );

        this.initEvents();
    },

    track(track) {
        try {
            if ($.isFunction(track)) {
                track();
            } else {
                var fn = new Function(track);
                fn();
            }
        } catch (e) {
            if (window.console) {
                window.console.log(e);
            }
        }
    },

    applyPlayTrack() {
        // 播放打点
        var track = this.playTrack;
        var self = this;
        if (track) {
            this.on('track', function () {
                self.track(track);
            });
        }
    },

    /**
     * 绑定初始 ready 事件
     */
    initEvents() {
        this.on('ready', () => {
            this.readyState = 'complete';
            this.vidElem = document.getElementById(this.vid);

            var readyCalls = this.readyCalls;
            for (var i = 0; i < readyCalls.length; i++) {
                readyCalls[i].call(this, this, this.vidElem);
            }
        });

        this.on('stageclick', () => {
            EMITTER.trigger('click_' + this.vid);
        });

        this.on('ended', () => {
            if (this.options.loop) {
                var _t = setTimeout(() => {
                    this.replay();
                }, 100);
                timers.push(_t);
            }
        });

        this.on('playing', () => {
            // 用于首次播放时的打点
            if (this.__not_first) {
                return;
            }
            this.__not_first = true;
            EMITTER.trigger('track_' + this.vid);
        });

        this.applyPlayTrack();
    },

    /**
     * onReady 添加回调
     */
    ready(readyFunc) {
        if (this.readyState === 'complete') {
            readyFunc.call(this, this, this.vidElem, this.$wrap);
        } else {
            this.readyCalls.push(readyFunc);
        }
        return this;
    },

    /**
     * 设置视频源
     * @param {String} src 视频源路径
     */
    setSource(src) {
        this.vidElem.vjs_src(src);
        return this;
    },

    play() {
        // 防止出现问题
        // TODO: loop 时如何判定
        var dura = this.prop('duration');
        if (dura > 0 && dura <= this.prop('currentTime')) {
            if (!this.options.loop) {
                this.pause();
            } else {
                this.replay();
            }
        } else {
            this.vidElem.vjs_play();
        }
        return this;
    },

    pause() {
        this.vidElem.vjs_pause();
        return this;
    },

    prop(name, value) {
        var elem = this.vidElem;

        if (arguments.length === 1) {
            return elem.vjs_getProperty(name);
        }

        if (name === 'src') {
            if (/^rtmp:\/\//.test(value)) {
                var idx = value.split('?')[0].lastIndexOf('/');
                elem.vjs_setProperty('rtmpConnection', value.slice(0, idx + 1));
                elem.vjs_setProperty('rtmpStream', value.slice(idx + 1));
                this.options.isRTMP = true;
            } else {
                elem.vjs_setProperty(name, value);
                this.options.isRTMP = false;
            }
        } else {
            elem.vjs_setProperty(name, value);
        }
        return this;
    }
};

var vPlayer = module.exports = function (selector, options) {
    if (!options || !options.src) {
        throw 'option src needed!';
    }

    options.isRTMP = /^rtmp:\/\//.test(options.src);
    var player = new SwfPlayer(selector, options);
    player.mode = 'swf';
    return player;
};

vPlayer.timers = timers;

/**
 * 事件回调
 */
vPlayer.onEvent = function (vid, eventName) {
    EMITTER.trigger(eventName + '_' + vid);
};

/**
 * 发生错误
 */
vPlayer.onError = function (vid, eventName) {
    EMITTER.trigger('error_' + vid, eventName);
};

/**
 * flash ready
 */
vPlayer.onReady = function (vid) {
    EMITTER.trigger('ready_' + vid);
};

/**
 * debug in console
 */
vPlayer.debug = function (vid) {
    return vid ? debugInfo[vid] : debugInfo;
};
vPlayer.debug.emitter = EMITTER;

/**
 * log events 
 */
EMITTER._trigger = EMITTER.trigger;
EMITTER.trigger = function (eventName) {
    if (vPlayer.debugMode && window.console) {
        console.log(eventName);
    }

    EMITTER._trigger(eventName);
};
vPlayer.toggleEventLog = function () {
    vPlayer.debugMode = !vPlayer.debugMode;
};