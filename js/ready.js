var screenfull = require('./screenfull');
var timers = require('./timers');

module.exports = function ready(player, elem) {
    window['swf_' + elem.id] = player;
    
    // 最外层
    var $document = $(document);
    var $playerWrap = player.$wrap;
    var _$ = function (selector) {
        return $playerWrap.find(selector);
    };

    $.fn.ctrlSlider = function (option) {
        var $dur = option.duration;
        var $cur = option.current;
        var $ctr = option.controller;
        var $self = this;

        this.on('mousedown', function (e) {
            e.preventDefault();

            if (option.onstart) {
                option.onstart();
            }

            var left = $self.offset().left;
            var width = $self.width();
            
            var calcPercent = function (e) {
                var delataX = e.clientX - left;
                delataX = delataX < 0 ? 0 : (delataX > width ? width : delataX);

                var percent = delataX / $dur.width();
                $cur.css('width', delataX);
                $ctr.css('left', (width - $ctr.width()) * percent );
                return percent;
            };
            
            var mousemove = 'mousemove.' + (+new Date());
            var update = function (e) {
                if (option.onchange) {
                    option.onchange(calcPercent(e));
                }
            };

            $document.on(mousemove, throttle(update, 100, true));
            $document.one('mouseup', function (e) {
                $document.off(mousemove);
                if (option.onend) {
                    option.onend(calcPercent(e));
                } 
            });
            update(e);
        });
        return this;
    };

    // 右键
    // TODO 添加版权信息
    // if (player.mode !== 'swf') {
    //     $playerWrap.on('contextmenu', function () {
    //         // console.log(e);
    //     });
    // }

    //-----------------------------------------------------------------------
    // 控制面板
    var $controlPane = _$('.video-control');
    // 时间显示
    var $progressTime = $playerWrap.find('.video-time');

    // 是否为静默状态
    var isSilent = function () {
        return player.prop('ended') || player.prop('paused') && player.prop('currentTime') === 0;
    };

    // 显示控件
    var showControlPane = function () {
        // 静默状态下不显示
        if (isSilent()) {
            return;
        }

        $controlPane.animate({
            bottom: 0,
            opacity: 1
        }, 300);
    };
    // 隐藏控件
    var hideControlPane = function () {
        // 暂停情况下 还是需要显示控件
        if (!isSilent() && player.prop('paused') || isFullScreen()) {
            return;
        }

        $controlPane.animate({
            bottom: -40,
            opacity: 0
        }, 200);
    };

    // 鼠标移入控制切换显示状态
    $playerWrap
        .on('mouseenter', showControlPane)
        .on('mouseleave', hideControlPane);

    // 小容器下面的样式修正
    // 目前主要做的是隐藏时间
    var hideProgressTime = true;
    var updateControlView = function () {
        hideProgressTime = $controlPane.width() <= 250;
        if (hideProgressTime) {
            $progressTime.hide();
        } else {
            $progressTime.show();
        }
    };
    updateControlView();

    //--------------------------------------------------------------------------------------
    // 播放进度相关
    // 时间格式化
    var leftPad = function (num) {
        return '' + (num < 0 ? num : (num < 10 ? '0' + num : num));     
    };
    var format = function (seconds) {
        seconds = Math.round(+seconds);
        if (isNaN(seconds)) {
            seconds = 0;
        }
        return leftPad(Math.floor(seconds / 60)) + ':' + leftPad(Math.floor(seconds % 60));
    };
    // 进度部分
    var $progressWrap = _$('.video-progress');
    // 总时长进度条
    var $progressElem = _$('.v-p-total');
    // 进度条
    var $progressPassed = _$('.v-p-cur');
    // 进度控制按钮
    var $progressCircle = _$('.v-p-ctrl');
    // 进度条总长度
    var PROGRESS_TOTAL = $progressElem.width();

    // window resize 或窗口形状变化时 更新进度条
    var updateTimeline = function () {
        // 更新总长度
        PROGRESS_TOTAL = $progressElem.width();
    };

    // 更新进度显示
    var IS_SLIDING = false;
    var CIRCLE_WIDTH = 0;

    var updateProgressUI = function () {
        if (IS_SLIDING) {
            return;
        }

        CIRCLE_WIDTH = CIRCLE_WIDTH || $progressCircle.width();

        var currTime = player.prop('currentTime');
        if (isNaN(currTime)) {
            currTime = 0;
        }

        var duraTime  = player.prop('duration');
        if (isNaN(duraTime) || duraTime <= 0) {
            $progressTime.text('--:--');
        } else {
            $progressTime.text(format(currTime) + '/' + format(duraTime));
        }

        // 更新进度条样式
        var percent = 0;
        
        if (duraTime !== 0) {
            percent = currTime / duraTime;
        }

        percent = Math.round(percent * 100) / 100;
        
        $progressPassed.css('width', PROGRESS_TOTAL * percent);
        $progressCircle.css('left',  (PROGRESS_TOTAL - CIRCLE_WIDTH) * percent);
    };

    $progressWrap.ctrlSlider({
        duration: $progressElem, 
        current: $progressPassed,
        controller: $progressCircle,
        onstart: function () {
            IS_SLIDING = true;
            player.pause();
        },
        onchange: function (percent) {
            var dura = player.prop('duration');
            percent = percent < 0.95 ? percent : 0.95;
            player.seekTo(percent * dura);
            $progressTime.text(format(dura * percent) + '/' + format(dura));
        },
        onend: function (percent) {
            IS_SLIDING = false;
            percent = percent < 0.95 ? percent : 0.95;
            player.seekTo(percent * player.prop('duration'));
            player.play();
        }
    });

    // -------------------------------------------------------------------
    var $videoPlayBtn  = _$('.video-control-play');
    var $videoPlayIcon = _$('.video-control-play-btn');
    var CLASS_PLAYING = 'video-control-play-btn__playing';

    var $posterAndPlayBtn = _$('.vplayer-poster, .vplayer-play-btn');
    var $playBtn = _$('.vplayer-play-btn');
    var $poster = _$('.vplayer-poster');
    var $loading = _$('.vplayer-loading');
    var CLASS_PLAY_PAUSED = 'vplayer-play-pause';
    var timer = null;
    
    $videoPlayBtn.on('click', function () {
        togglePlay();
    });
    
    $playBtn.on('click', function() {
        togglePlay();
        showControlPane();
    });

    // 开始加载
    player.on('loadstart', function () {
        if (player.mode === 'video' && player.options.preload && !player.options.autoplay) {
            return;
        }
        $posterAndPlayBtn.hide();
        $loading.show();
    });

    // 假如是直播
    // 则 duration 会是 0
    // 判断简单粗暴一点
    player.on('durationchange', function () {
        if (player.prop('duration') <= 0) {
            $progressTime.hide();
            $progressWrap.hide();
        } else {
            if (!hideProgressTime) {
                $progressTime.show();
            }
            $progressWrap.show();
        }
    });

    // 可以播放
    player.on('canplaythrough', function () {
        clearInterval(timer);
        updateProgressUI();
        $videoPlayIcon.addClass(CLASS_PLAYING);

        timer = setInterval(function() {
            updateProgressUI();
        }, 30);
        timers.push(timer);

        $posterAndPlayBtn.hide();
        
        var _t = setTimeout(function () {
            $loading.hide();
        }, 0);
        timers.push(_t);
    });

    player.on('playing', function () {
        updateProgressUI();
        $videoPlayIcon.addClass(CLASS_PLAYING);
        
        clearInterval(timer);
        timer = setInterval(function() {
            updateProgressUI();
        }, 30);
        timers.push(timer);

        $posterAndPlayBtn.hide();
    });

    player.on('pause', function() {
        clearInterval(timer);
        updateProgressUI();
        showControlPane();
        // 停下来
        $videoPlayIcon.removeClass(CLASS_PLAYING);
        $playBtn.addClass(CLASS_PLAY_PAUSED).show();
    });

    // 结束后回到开头
    player.on('ended', function () {
        clearInterval(timer);
        updateProgressUI();
        hideControlPane();
        // 非loop播放的情况下停下来
        if (!player.options.loop) {
            $videoPlayIcon.removeClass(CLASS_PLAYING);
            $posterAndPlayBtn.show();
            $playBtn.removeClass(CLASS_PLAY_PAUSED);
        }
    });


    //----------------------------------------------------------
    var clickUrl = player.clickUrl;
    var clickTrack = player.clickUrlTrack;
    if (clickUrl) {
        $poster.css('cursor', 'pointer');
    }
    var openUrl = function () {
        if (clickUrl && !isFullScreen()) {
            player.track(clickTrack);
            window.open(clickUrl);
        } 
    };
    // 跳转打点
    $poster.on('click', openUrl);
    player.on('click', function () {
        player.pause();
        openUrl();
    });

    //-----------------------------------------------------------------------
    // 音量切换
    var $volumeFull = _$('.volume-total');
    var $volumeCurr = _$('.volume-cur');
    var $volumeCtrl = _$('.volume-ctrl');
    var $muteToggleBtn = _$('.video-volume-btn');

    _$('.video-volume-ctrl').ctrlSlider({
        duration: $volumeFull, 
        current: $volumeCurr,
        controller: $volumeCtrl,
        onstart: function () {},
        onchange: function (percent) {
            player.prop('muted', false);
            player.prop('volume', percent);
        },
        onend: function (percent) {
            player.prop('muted', false);
            player.prop('volume', percent);
        }
    });

    var setVolumeUI = function (volume) {
        var btn = $muteToggleBtn[0];

        var w = $volumeFull.width();
        $volumeCtrl.css('left', volume * (w - $volumeCtrl.width()));
        $volumeCurr.css('width', volume * w);

        var isMuted = player.prop('muted');
        var className = 'video-volume-btn__' + (
            (volume === 0 || isMuted) ? 'muted' : (
                (volume <  1/3) ? 1 : ((volume < 2/3) ? 2 : 3)
            )
        );
        
        btn.className = btn.className.replace(/video-volume-btn__(\d|muted)/g, '') + className;
    };
    
    var updateVolumeUI = function () {
        setVolumeUI(player.prop('muted') ? 0 : player.prop('volume'));
    };
    // 自动更新下 UI
    updateVolumeUI();

    player.on('volumechange', function () {
        var volume = player.prop('volume');
        if (volume < 0.01 && volume > 0) {
            player.prop('volume', 0);
        }
        
        // 静音状态则 UI 归零
        if (player.prop('muted')) {
            volume = 0;
        } else {
            // 非静音状态 但 volume 为 0
            // if (player.prop('volume') === 0) {
            //     player.prop('volume', 1);
            //     return;
            // }
        }
        setVolumeUI(volume);
    });

    $muteToggleBtn.on('click', function () {
        player.prop('muted', !player.prop('muted'));
    });

    //-----------------------------------------------------------------------
    // 全屏切换
    var $expandBtn  = _$('.video-expand');
    var $expandIcon = _$('.video-expand-btn');
    var CLASS_FULL_SCREEN = 'video-wrapper__fullscreen';
    var CLASS_BTN_EXPAND  = 'video-expand-btn__expanded';
    var CLASS__FULL_SCREEN_IDENT = 'isFullScreen';

    var $rootBody = $('html, body');
    var CLASS_BODY_HIDDEN = 'body__hidden';
    /**
     * 控制全屏切换
     * 切换的同时 更新 UI
     */
    var toggleFullScreen = function () {
        $rootBody.toggleClass(CLASS_BODY_HIDDEN);

        if (screenfull) {
            screenfull.toggle($playerWrap[0]);
        } else {
            $playerWrap.toggleClass(CLASS_FULL_SCREEN);
        }
        $expandIcon.toggleClass(CLASS_BTN_EXPAND);
        $playerWrap.toggleClass(CLASS__FULL_SCREEN_IDENT);

        updateControlView();
        updateTimeline();
        updateVolumeUI();
        updateProgressUI();
    };

	player.exitFullscreen = function () {
	    if (isFullScreen()) {
		    toggleFullScreen();
		}
	};

    if (!screenfull && !player.options.simulateFullScreen) {
        $expandIcon.hide();
    } else {
        $expandBtn.on('click', toggleFullScreen);
    }

    // 真正全屏状态下  ESC退出时
    // keydown 事件是无法捕获到的
    // 所以只能通过 fullscreenchange 事件进行
    if (screenfull) {
        $(window).on(screenfull.raw.fullscreenchange, function () {
            if (!screenfull.isFullscreen) {
                $rootBody.removeClass(CLASS_BODY_HIDDEN);
                $expandIcon.removeClass(CLASS_BTN_EXPAND);
                $playerWrap.removeClass(CLASS_FULL_SCREEN);
                $playerWrap.removeClass(CLASS__FULL_SCREEN_IDENT);
            } else {
                $rootBody.addClass(CLASS_BODY_HIDDEN);
            }
            
            updateControlView();
            updateTimeline();
            updateVolumeUI();
            updateProgressUI();
        });
    }

    //-----------------------------------------------------------------------
    // 双击全屏切换支持
    // var lastClick = 0;
    // var timeout = null;
    // player.on('click', function () {
    //     clearTimeout(timeout);
    //     if (+new Date() - lastClick < 300) {
    //         toggleFullScreen();
    //         lastClick = 0;
    //     } else {

    //         lastClick = +new Date();
    //         timeout = setTimeout(function () {
    //             lastClick = 0;
    //             togglePlay();
    //         }, 300);
    //         timers.push(timeout);
    //     }
    // });

    // incr : [0, 1]
    function increaseVolumeBy(incr) {
        var vol = player.prop('volume');
        var res = vol + incr;
        res = res < 0 ? 0 : (res > 1 ? 1 : res);

        if (player.prop('muted') && res > 0) {
            player.prop('muted', false);
        }

        player.prop('volume', res);
    }

    // TODO: 暂时不支持键盘快进
    // 进度百分比
    // incr: [0, 1]
    function seekByDecimal(incr) {
        if (player.mode === 'swf') {
            return;
        }
        var dura = player.prop('duration');

        // duration 为 0
        // 或者已经播放结束且在快进时
        // 禁止
        if (!dura || player.prop('ended') && incr > 0) {
            return;
        }

        var cur = player.prop('currentTime') / dura;
        var res = cur + incr;

        res = res < 0 ? 0 : (res > 1 ? 1 : res);
        player.seekTo(dura * res);

        if (res === 1) {
            if (player.options.loop) {
                player.replay();
            } else {
                player.pause();
            }
        } else {
            player.play();
        }
    }

    function handleArrowKeyPress(key) {
        switch (+key) {
            case 37: // ←
                return seekByDecimal(-0.1);
            case 39: // →
                return seekByDecimal(+0.1);
            case 38: // ↑
                return increaseVolumeBy(+0.1);
            case 40: // ↓
                return increaseVolumeBy(-0.1);
        }
    }
    //-----------------------------------------------------------------------
    // flash 假全屏状态下
    // 保证能够使用 ESC(27) 退出
    // 使用 F5(116) 刷新
    // 空格(32) 暂停
    $document.on('keydown.vjs', function (e) {
        // 非全屏状态 不管
        if(!isFullScreen()) {
            return;
        }

        var key = +e.keyCode;
        if(key === 116) {
            location.reload();
        } else if (key === 27) {
            toggleFullScreen();
        } else if (key === 32) {
            togglePlay();
        } else {
            handleArrowKeyPress(key);
        }
    });

    // flash 模式下 ESC
    if (player.mode === 'swf') {
        player.on('esc', function () {
            if (isFullScreen()) {
                toggleFullScreen();
            }
        });
    }

    // 空格键控制
    // 非全屏状态下 
    // 空格键控制播放 以及 F5 控制刷新的功能都不受限制 
    $playerWrap.on('keydown.vjs', function (e) {
        if (isFullScreen()) {
            return;
        }

        var key = e.keyCode;
        if (key === 32) {
            togglePlay();
        } else if (key === 116) {
            location.reload();
        } else {
            handleArrowKeyPress(key);
        }
    }).on('selectstart', function (e) {
        e.preventDefault();
    }); 

    // 窗口尺寸变化时
    $(window).on('resize', throttle(function () {
        updateControlView();
        updateTimeline();
        updateVolumeUI();
        // 已经停止或已经放完之后 需要手动更新
        // 播放时只更新 PROGRESS_TOTAL 就足够
        if (player.prop('ended') || player.prop('paused')) {
            updateProgressUI();
        }
    }, 100));

    //-----------------------------------------------------------------------
    /**
     * 播放停止相互切换
     */
    function togglePlay() {
        // ended 在前 
        // H5 模式下 ended 时也会 paused
        if (player.prop('ended')) {
            return player.replay();
        }
        
        if (player.prop('paused')) {
            return player.play();
        }

        player.pause();
    }

    function isFullScreen() {
        return $playerWrap.hasClass(CLASS__FULL_SCREEN_IDENT);
    }

    function throttle(fn,delay, immediate, debounce) {
        var curr = +new Date(),//当前事件
            last_call = 0,
            last_exec = 0,
            timer = null,
            diff, //时间差
            context,//上下文
            args,
            exec = function () {
                last_exec = curr;
                fn.apply(context, args);
            };
        return function () {
            curr= +new Date();
            context = this;
            args = arguments;
            diff = curr - (debounce ? last_call : last_exec) - delay;
            clearTimeout(timer);
            if (debounce) {
                if (immediate) {
                    timer = setTimeout(exec, delay);
                } else if (diff >= 0) {
                    exec();
                }
            } else {
                if (diff >= 0) {
                    exec();
                } else if (immediate) {
                    timer = setTimeout(exec, -diff);
                }
            }
            timers.push(timer);
            last_call = curr;
        };
    }
};

