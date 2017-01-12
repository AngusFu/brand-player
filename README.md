# Brand Player

## Note

- 兼容到 IE7
- 修改源码时尽量使用 ES3
- 注意避免 default、catch 等关键字
- 源码千尽量不要依赖外部模块
- 目前只支持在 MP4 的情况下使用 HTML5 播放器 

## Usage

```javascript
var vplayer = $.vPlayer("#container", {
    clickUrl: "http://baidu.com",
    // 点击跳转打点
    clickUrlTrack: function () {
        alert(222)
    },
    // 每次从头播放时打点
    playTrack: "console.log('start palying')",
    // 海报
    poster: "//p4.ssl.qhimg.com/t01a035f4e6470c150c.png",
    // 视频源
    src: "//s7.qhres.com/static/5381f58c2f241dce.mp4",
    loop: false,
    preload: false,
    autoplay: false,
    muted: true
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
  playerInstance.on('click', fn);
  // pause
  playerInstance.on('pause', fn);
  // start to play
  playerInstance.on('playing', fn);
  // ended
  playerInstance.on('ended', fn);
  // ...
});

// every time one event called
// the event name will be shown in console
window.vPlayer.toggleEventLog();

```



