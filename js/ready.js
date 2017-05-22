var screenfull = require('./screenfull');
var pushSo = function (t) {
    if (window.So) {
        So.page.timers.push(t);
    }
};
module.exports = function ready(player, elem) {
    var playOpts = player.options;
    window['swf_' + elem.id] = player;

    if (playOpts.isRTMP) {
        player.prop('src', playOpts.src);
    }

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
                $ctr.css('left', (width - $ctr.width()) * percent);
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
    //-----------------------------------------------------------------------
    // 控制面板
    var $controlPane = _$('.video-control');

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

    // -------------------------------------------------------------------
    var $videoPlayBtn = _$('.video-control-play');
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

    $playBtn.on('click', function () {
        togglePlay();
        showControlPane();
    });

    // 开始加载
    player.on('loadstart', function () {
        $posterAndPlayBtn.hide();
        $loading.show();
    });

    // 可以播放
    player.on('canplaythrough', function () {
        $videoPlayIcon.addClass(CLASS_PLAYING);
        $posterAndPlayBtn.hide();
        $loading.hide();
    });

    player.on('playing', function () {
        $videoPlayIcon.addClass(CLASS_PLAYING);
        $posterAndPlayBtn.hide();
    });

    player.on('pause', function () {
        showControlPane();
        $videoPlayIcon.removeClass(CLASS_PLAYING);
        $playBtn.addClass(CLASS_PLAY_PAUSED).show();
    });

    // 结束后回到开头
    player.on('ended', function () {
        hideControlPane();
        $videoPlayIcon.removeClass(CLASS_PLAYING);
        $posterAndPlayBtn.show();
        $playBtn.removeClass(CLASS_PLAY_PAUSED);
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
                (volume < 1 / 3) ? 1 : ((volume < 2 / 3) ? 2 : 3)
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
        }
        setVolumeUI(volume);
    });

    $muteToggleBtn.on('click', function () {
        player.prop('muted', !player.prop('muted'));
    });

    //-----------------------------------------------------------------------
    // 全屏切换
    var $expandBtn = _$('.video-expand');
    var $expandIcon = _$('.video-expand-btn');
    var CLASS_FULL_SCREEN = 'video-wrapper__fullscreen';
    var CLASS_BTN_EXPAND = 'video-expand-btn__expanded';
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
        updateVolumeUI();
    };

    if (!screenfull && !playOpts.simulateFullScreen) {
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
            updateVolumeUI();
        });
    }

    function increaseVolumeBy(incr) {
        var vol = player.prop('volume');
        var res = vol + incr;
        res = res < 0 ? 0 : (res > 1 ? 1 : res);

        if (player.prop('muted') && res > 0) {
            player.prop('muted', false);
        }

        player.prop('volume', res);
    }

    function handleArrowKeyPress(key) {
        switch (+key) {
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
        if (!isFullScreen()) {
            return;
        }

        var key = +e.keyCode;
        if (key === 116) {
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
    $(window).on('resize', throttle(updateVolumeUI, 100));

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

    function throttle(fn, delay, immediate, debounce) {
        var curr = +new Date(), //当前事件
            last_call = 0,
            last_exec = 0,
            timer = null,
            diff, //时间差
            context, //上下文
            args,
            exec = function () {
                last_exec = curr;
                fn.apply(context, args);
            };
        return function () {
            curr = +new Date();
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

            timer && pushSo(timer);
            last_call = curr;
        };
    }
};