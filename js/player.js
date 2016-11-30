var RESOURCE = require('../config')[/^https\:\/\//.test(location.href) ? 'https' : 'http'];

var loadCSS = require('./loadCSS');
var cssText = require('../css/styles.css');

loadCSS(
    cssText.replace(/__sprite/g, RESOURCE['sprite'])
);

var $template = $(require('../html/player.html'));
var swfobject = require('./swfobject');
var SimpleEventEmitter = require('./emitter');
var EMITTER  = new SimpleEventEmitter();

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
        swfUrl: RESOURCE['swf'],
        loading: RESOURCE['loading'],
        bgcolor: '#000',
        preload: false,
        loop: false,
        autoplay: false,
        muted: false,
        volume: 1
    }, options);
    
    this.options = options;

    this.vid = this.getVID();
    debugInfo[this.vid] = this;
    this.readyCalls = [ require('./ready') ];

    var $container = $(selector);
    $container.empty();
    $template.clone().appendTo($container);
    this.$wrap = $container.find('.video-wrapper');
    this.$wrap.prepend('<div id="' + this.vid + '"></div>');

    this.clickUrl = $.trim(options.clickUrl || '');
    this.clickUrlTrack = $.trim(options.clickUrlTrack);
    this.playTrack = $.trim(options.playTrack);

    if (options.poster) {
        this.$wrap.find('.vplayer-poster img').attr('src', options.poster)
    }

    // 添加 loading 动画
    this.$wrap.find('.vplayer-loading').attr('src', options.loading);
    
    this.createPlayer();
};

SwfPlayer.prototype = {
    constructor: SwfPlayer,
    /**
     * 对外暴露事件接口
     */
    on: function(eventName, fn) {
        var events = eventName.split(/\s+/);
        for (var i = 0, len = events.length; i < len; i++) {
            EMITTER.on.call(EMITTER, events[i] + '_' + this.vid, fn);
        }
        return this;
    },

    off: function(eventName, fn) {
        var events = eventName.split(/\s+/);

        for (var i = 0, len = events.length; i < len; i++) {
            EMITTER.off.call(EMITTER, events[i] + '_' + this.vid, fn);
        }
        return this;
    },

    /**
     * 生成 guid 
     */
    getVID: function() {
        return 'vjs_' + (+new Date())
    },

    /**
     * 利用 swfobject.js 生成 flash 播放的 DOM 节点
     */
    createPlayer: function() {
        this.mode = 'swf';
        this.$wrap.css('background-color', this.options.bgcolor);

        var flashvars = {
            src: this.options.src,
            autoplay: this.options.autoplay,
            preload: this.options.preload,
            loop: this.options.loop,
            volume: this.options.volume,
            muted: this.options.muted,
            allowFullScreen: true,
            wmode: 'transparent'
        };

        var params = {
            allowScriptAccess: "always",
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
            "100%",
            "100%",
            "10.3",
            "",
            flashvars,
            params,
            attributes
        );

        this.initEvents();
    },

    /**
     * 绑定初始 ready 事件
     */
    initEvents: function() {
        /**
         * 绑定事件
         */
        var cxt = this;
        
        this.on('ready', function() {
            cxt.readyState = 'complete';
            cxt.vidElem = document.getElementById(cxt.vid);
            // cxt.options.volume && cxt.prop('volume', cxt.options.volume);

            var readyCalls = cxt.readyCalls;
            for (var i = 0, len = readyCalls.length; i < len; i++) {
                readyCalls[i].call(cxt, cxt, cxt.vidElem);
            }
        }).on('stageclick', function() {
            EMITTER.fire('click_' + cxt.vid);
        }).on('ended', function () {
            if (cxt.options.loop) {
                setTimeout(function () {
                    cxt.replay();
                }, 100);
            }
        }).on('playing', function () {
            // 用于首次播放时的打点
            if (cxt.__not_first) {
                return;
            }
            cxt.__not_first = true;
            EMITTER.fire('track_' + cxt.vid); 
        });

        // 播放打点
        var track = this.playTrack;
        if (track) {
            this.on('track', function () {
                try {
                    var fn = new Function(track);
                    fn();
                } catch (e) {}
            });
        }
    },

    /**
     * onReady 添加回调
     */
    ready: function(readyFunc) {
        if (this.readyState === 'complete') {
            readyFunc.call(this, this, this.vidElem);
        } else {
            this.readyCalls.push(readyFunc);
        }
        return this;
    },

    /**
     * 设置视频源
     * @param {String} src 视频源路径
     */
    setSource: function (src) {
        this.vidElem.vjs_src(src);
        return this;
    },

    play: function() {
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

    pause: function() {
        this.vidElem.vjs_pause();
        return this;
    },

    /**
     * 视频跳转
     * @param  {Number} seconds 视频跳到指定秒数
     */
    seekTo: function(seconds) {
        this.prop("currentTime", seconds);
        return this;
    },

    replay: function () {
        this.seekTo(0);
        var self = this;
        if (self.prop('paused')) {
            self.play();
        }
        setTimeout(function () {
            if (self.prop('paused')) {
                self.play();
            }

            // 重新播放的时候，用于打点
            EMITTER.fire('track_' + self.vid);
        }, 0);
    },

    prop: function(name, value) {
        var elem = this.vidElem;

        if (arguments.length === 1) {
            return elem.vjs_getProperty(name);
        }

        elem.vjs_setProperty(name, value);

        return this;
    }
};

function VideoPlayer() {
    // 原型冒充
    SwfPlayer.apply(this, arguments);
} 

var videoPlayProto = {
    constructor: VideoPlayer,
    addAttrs: function(obj) {
        for (var key in obj) if (obj.hasOwnProperty(key)) {
            if (obj[key]) {
                this.vidElem[key] = obj[key];
            }
        }
    },

    /**
     * 利用 swfobject.js 生成 flash 播放的 DOM 节点
     */
    createPlayer: function() {
        this.mode = 'video';
        this.$wrap.css('background-color', this.options.bgcolor);

        var $elem = $('<video />');
        this.vidElem = $elem[0];

        this.addAttrs({
            controls: false,
            id: this.vid,
            name: this.vid,
            src: this.options.preload ? this.options.src : '',
            preload: this.options.preload,
            // loop 不应直接添加给 video 元素
            // 否则 IE 11 下面监听不到事件
            // loop: this.options.loop,
            autoplay: this.options.autoplay,
            muted: this.options.muted
        });
        $elem.css({
            width: '100%',
            height: '100%'
        });
        this.$wrap.prepend($elem);
        this.vidElem['volume'] = this.options.volume;
        this._lastVolume = this.options.volume;

        this.initEvents();
    },

    /**
     * 绑定初始 ready 事件
     */
    initEvents: function() {
        /**
         * 绑定事件
         */
        var cxt = this;
        this.on('ended', function () {
            if (cxt.options.loop) {
                setTimeout(function () {
                    cxt.replay();
                }, 100);
            }
        }).on('playing', function () {
            // 用于首次播放时的打点
            if (cxt.__not_first) {
                return;
            }
            cxt.__not_first = true;
            EMITTER.fire('track_' + cxt.vid); 
        });

        // 播放打点
        var track = this.playTrack;
        if (track) {
            this.on('track', function () {
                try {
                    var fn = new Function(track);
                    fn();
                } catch (e) {}
            });
        }

        var vid = this.vid;
        var elem = document.getElementById(vid);
        var events = [ 'canplaythrough', 'durationchange', 'playing', 'play', 'loadstart', 'pause', 'ended', 'volumechange', 'click' ];
        $.each(events, function (i, name) {
            $(elem).on(name, function (){
                EMITTER.fire(name + '_' + vid);
            });
        });

        // ready....
        var readyCalls = cxt.readyCalls;
        var fn = null;

        while (readyCalls.length) {
            fn = readyCalls.shift();
            fn.call(cxt, cxt, elem);
        }

        cxt.readyState = 'complete';
    },

    /**
     * 设置视频源
     * @param {String} src 视频源路径
     */
    setSource: function (src) {
        this.prop('src', src);
        return this;
    },

    play: function() {
        // 不预加载的情况
        if (!this.options.preload && !this.prop('currentSrc')) {
            this.vidElem['src'] = this.options.src;
        }
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
            this.vidElem.play();
        }
        return this;
    },

    pause: function() {
        this.vidElem.pause();
        return this;
    },

    /**
     * 视频跳转
     * @param  {Number} seconds 视频跳到指定秒数
     */
    seekTo: function(seconds) {
        this.vidElem.currentTime = seconds;
        return this;
    },

    replay: function () {
        // this.seekTo(0);
        // if (this.prop('paused')) {
        //     this.play();
        // }
        this.vidElem.currentTime = 0;
        this.vidElem.play();
        
        var self = this;
        setTimeout(function () {
            if (self.prop('paused')) {
                self.play();
            }

            // 重新播放的时候，用于打点
            EMITTER.fire('track_' + self.vid);
        }, 0);
    },

    prop: function(name, value) {
        var elem = this.vidElem;
        if (arguments.length === 1) {
            if (name == 'lastVolume') {
                return this._lastVolume > 0 ? this._lastVolume : 1;
            }
            return elem[name];
        }
        
        elem[name] = value;
        // if (name === 'muted') {
        //     elem['volume'] = Number(!value);
        // } else if (name === 'volume' && value > 0) {
        //     elem['muted'] = false;
        // }

        if (name === 'volume') {
            this._lastVolume = elem['volume'];
        }

        return this;
    }
};

VideoPlayer.prototype = $.extend({}, SwfPlayer.prototype, videoPlayProto);

var supportsMP4 = (function () {
    var elem = document.createElement('video');
    var res = '';
    try {
        res = elem.canPlayType && elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');
    } catch (e) {}
    elem = null;
    return !!res;
}());

$.vPlayer = window.vPlayer = function (selector, options) {
    if (!options || !options.src) throw 'option src needed!';
    var player;
    // 指定为 swf
    var forceSwf = options.mode === 'swf';
    // 不是 mp4 类型(暂时忽略不常用的 ogg 等格式)
    var typeUnfit = !/mp4$/i.test(options.src + '');
    // 还有一种情况是浏览器压根不支持 video
    if (!supportsMP4 || forceSwf || typeUnfit) {
        player = new SwfPlayer(selector, options);
        player.mode = 'swf';
    } else {
        player = new VideoPlayer(selector, options);
        player.mode = 'video';
        
        player.$wrap.on('contextmenu', function (e) {
            e.preventDefault();
        });
    }
    
    return player;
};

/**
 * 引入 jQuery 插件模式
 */
$.fn.vPlayer = function () {
    this.each(function (i, el) {
        var $el = $(el);
        var config = {};
        config['mode'] = $el.attr('mode'); 
        config['src']  = $el.attr('src'); 
        
        var loop = $el.attr('loop');
        if (loop !== void 0) {
            config['loop'] = true;
        }

        // preload="auto" 需要与 autoplay="true" 一起使用 否则会出问题
        // 这里的设置实际上是无效的
        // 不过我打算先不管了
        // 2016-11-21
        var preload = $el.attr('preload');
        if (preload !== void 0) {
            config['preload'] = true;
        }

        var autoplay = $el.attr('autoplay');
        if (autoplay !== void 0) {
            config['autoplay'] = true;
        }

        var muted = $el.attr('muted');
        if (muted !== void 0) {
            config['muted'] = true;
        }

        var volume = $el.attr('volume');
        if (volume !== void 0) {
            config['volume'] = parseFloat(volume);
        }

        var poster = $el.attr('poster');
        if (poster) {
            config['poster'] = poster;
        }

        var href = $.trim($el.attr('href'));
        if (href) {
            config['clickUrl'] = href;
        }

        var onHrefOpen = $.trim($el.attr('onurlopen'));
        if (onHrefOpen) {
            config['clickUrlTrack'] = onHrefOpen;
        }

        var onPlay = $.trim($el.attr('onplay'));
        if (onPlay) {
            config['playTrack'] = onPlay;
        }

        var swfUrl = $.trim($el.attr('swf'));
        if (swfUrl) {
            config['swfUrl'] = swfUrl;
        }

        $.vPlayer($el, config);
    });

    return this;
};

/**
 * 事件回调
 */
vPlayer.onEvent = function (vid, eventName) {
    EMITTER.fire(eventName + '_' + vid);
};

/**
 * 发生错误
 */
vPlayer.onError = function (vid, eventName) {
    EMITTER.fire('error_' + vid, eventName);
};

/**
 * flash ready
 */
vPlayer.onReady = function (vid) {
    EMITTER.fire('ready_' + vid);
};

/**
 * debug in console
 */
vPlayer.debug = function (vid) {
    return vid ? debugInfo[vid] : debugInfo;
};

vPlayer.debug.events = EMITTER;
