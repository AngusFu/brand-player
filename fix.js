// Online hot fix
// SEE https://github.com/sindresorhus/screenfull.js/commit/04f9ec43ef810f84870b1bb72e005aab85b1bf58
;(function () {
  var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {}
  var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element

  var fn = (function () {
    var val

    var fnMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
      ],
      // New WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      // Old WebKit (Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
      ],
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
      ]
    ]

    var i = 0
    var l = fnMap.length
    var ret = {}

    for (; i < l; i++) {
      val = fnMap[i]
      if (val && val[1] in document) {
        for (i = 0; i < val.length; i++) {
          ret[fnMap[0][i]] = val[i]
        }
        return ret
      }
    }

    return false
  })()

  var origRequestFullScreen = Element.prototype[fn.requestFullscreen]
  Element.prototype[fn.requestFullscreen] = function () {
    origRequestFullScreen.call(this, keyboardAllowed ? Element.ALLOW_KEYBOARD_INPUT : {})
  }
})()
