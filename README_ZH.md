# Brand Player

## 特点

- 兼容至 IE7
- 基于 MP4 格式
- 能够完全控制播放元素
- 基于 HTML5 Video 元素 API

## 注意

定制的时候需要注意一下几点：

- 为保证兼容，尽可能使用 ES3 语法
- 避免使用 `default``catch` 等关键词作为变量名、键值
- 谨慎引入第三方文件

## 使用

```javascript
var vplayer = $.vPlayer("#container", {
    // mode=swf: 强制使用 FLASH 模式
    // mode: 'swf',

    // 点击视频需要打开的网址
    clickUrl: "//baidu.com",
    // 视频点击打点
    clickUrlTrack: function () {
        alert(222)
    },

    // 视频从头开始播放时记录的打点
    playTrack: "console.log('start palying')",
    
    // poster source
    poster: "//p4.ssl.qhimg.com/t01a035f4e6470c150c.png",

    // video source
    src: "//s4.ssl.qhres.com/static/5381f58c2f241dce.mp4",

    loop: false,
    preload: false,
    autoplay: false,
    muted: true,

    // default: true
    // 不支持原生全屏 API 的情况下是否启用模拟
    simulateFullScreen: false
});

vplayer.ready(function (
  playerInstance,
  videoElem,
  $wrapperElem
) {
  // control DOM: hide control bar
  $wrapperElem.find('.video-control').hide();

  // bind/unbind events for playerInstance
  // 1. unbind all click events on the stage
  playerInstance.off('click');
  // 2. bind events
  // stage click
  playerInstance.on('click', fnClick);
  // pause
  playerInstance.on('pause', fnPause);
  // start to play
  playerInstance.on('playing', fnPlaying);
  // ended
  playerInstance.on('ended', fnEnded);
  // ...


  // GET properties
  // Note: property names are like that of HTML5-video
  playerInstance.prop('duration');
  playerInstance.prop('muted');
  // ...
  
  // SET properties
  playerInstance.prop('volume', 0.5);
  playerInstance.prop('muted', true);
  // ...

  // control functions
  // ...
  playerInstance.play();
  playerInstance.pause();
});

// every time one event called
// the event name will be shown in console
window.vPlayer.toggleEventLog();

// this will return a playerInstance
// while `vjs_1484186882609` is id of video element
window.vPlayer.debug('vjs_1484186882609');

```
