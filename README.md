# Brand Player

> No longer maintained.

> For hot fix issue with Chrome 67+ with fullscreen API, just use [fix.js](./fix.js).

## Features

- IE7 Compitable
- MP4 Oriented
- Full Control over Video Element 
- Simple API: HTML5-like

## Notes

There are some rules you should follow when customizing.

- Use ES3
- Avoid keywords, e.g. `default` `catch`
- Take care when importing third-party packages
 
## Usage

```javascript
var vplayer = $.vPlayer("#container", {
    // force FLASH mode
    // mode: 'swf',

    // click on the stage will open a new window
    clickUrl: "//baidu.com",
    // click stage
    clickUrlTrack: function () {
        alert(222)
    },

    // every time the video replays from the begining
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
    // if set to false
    // fullscreen button will be hidden
    // when native fullScreen API unsupported
    simulateFullScreen: false
});

vplayer.ready(function (player, videoElem, $wrapperElem) {
  // control DOM: hide control bar
  $wrapperElem.find('.video-control').hide();

  // bind/unbind events for player
  // 1. unbind all click events on the stage
  player.off('click');
  // 2. bind events
  // stage click
  player.on('click', fnClick);
  // pause
  player.on('pause', fnPause);
  // start to play
  player.on('playing', fnPlaying);
  // ended
  player.on('ended', fnEnded);
  // ...


  // GET properties
  // Note: property names are like that of HTML5-video
  player.prop('duration');
  player.prop('muted');
  // ...
  
  // SET properties
  player.prop('volume', 0.5);
  player.prop('muted', true);
  // ...

  // control functions
  // ...
  player.play();
  player.pause();

  // exit fulllscreen
  player.exitFullscreen();
});

// every time one event called
// the event name will be shown in console
window.vPlayer.toggleEventLog();

// this will return a player
// while `vjs_1484186882609` is id of video element
window.vPlayer.debug('vjs_1484186882609');

```
