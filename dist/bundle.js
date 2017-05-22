(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vPlayer = factory());
}(this, (function () { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var config = {
  "swf": "//s5.ssl.qhres.com/static/fca83421739b4383.swf",
  "sprite": "//p5.ssl.qhimg.com/t0154249c11cb1852d0.png",
  "loading": "//p5.ssl.qhimg.com/t017699817e7d9bb0fd.gif"
};

var loadCSS = function (cssText) {
  var style = document.createElement('style');
  style.rel = 'stylesheet';
  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = cssText;
  } else {
    style.appendChild(document.createTextNode(cssText));
  }
  document.getElementsByTagName('head')[0].appendChild(style);
};

var styles = ".body__hidden{overflow:hidden !important}.video-wrapper{position:relative;width:100%;height:100%;background:#000;overflow:hidden !important;-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}.video-wrapper__fullscreen{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99999999999}.video-wrapper>video{display:block;width:100%;height:100%;outline:0 !important}.video-control{position:absolute;bottom:-40px;left:0;right:0;width:100%;height:30px;z-index:888;padding-top:10px;background:url(__sprite) 0 -190px;_padding-top:7px;_background-position:0 -195px}.video-volume,.video-expand{float:right}.video-control-play{float:left;overflow:hidden;padding:8px 10px 7px 20px}.video-control-play-btn:hover,.video-volume-btn:hover,.video-expand-btn:hover{opacity:.8;filter:alpha(opacity=80)}.video-control-play-btn{width:14px;height:15px;background:url(__sprite) no-repeat}.video-control-play-btn__paused{background-position:-20px -20px}.video-control-play-btn__playing{background-position:-40px -20px}.video-expand{padding:7px 20px 7px 16px}.video-expand-btn{width:18px;height:16px}.video-expand-btn__normal{background:url(__sprite) -60px -20px no-repeat}.video-volume{padding:7px 2px 7px 0}.video-volume-btn{display:block;width:19px;height:16px;background:url(__sprite) 0 0 no-repeat}.video-volume-btn__muted{background-position:0 0}.video-volume-btn__1{background-position:-20px 0}.video-volume-btn__2{background-position:-40px 0}.video-volume-btn__3{background-position:-60px 0}.video-volume-ctrl{float:right;width:30%;max-width:60px;min-width:40px;height:30px;position:relative}.volume-total{position:absolute;left:0;right:0;top:14px;height:2px;background-color:#fff}.volume-cur{float:left;height:2px;width:0;background-color:#fff}.volume-ctrl{position:absolute;left:0;top:-5px;width:12px;height:12px;background:url(__sprite) 0 -20px no-repeat}.vplayer-poster,.vplayer-poster img{position:absolute;left:0;right:0;top:0;bottom:0;width:100%;height:100%;z-index:999}.vplayer-loading,.vplayer-play-btn{width:70px;height:70px;position:absolute;left:50%;top:50%;margin-top:-35px;margin-left:-35px;cursor:pointer;z-index:1000}.vplayer-play-btn{background:url(__sprite) 0 -40px no-repeat}.vplayer-play-btn:hover{background-position:-80px -40px}.vplayer-play-pause{background-position:0 -120px !important}.vplayer-play-pause:hover{opacity:.8;filter:alpha(opacity=80)}.flash-tip{display:none;position:absolute;top:0;right:0;bottom:0;left:0;z-index:1111;background:#424242}.flash-tip a{position:absolute;top:0;right:0;bottom:0;left:0;height:40px;line-height:40px;text-align:center;color:#fff;overflow:hidden;text-overflow:ellipsis;margin:auto;text-decoration:none}\n";

var styles$1 = {
	__def: styles
};

var player$2 = "<div class=\"video-wrapper\"> <div class=\"video-control\"> <div style=\"overflow: hidden\"> <div class=\"video-control-play\"> <div class=\"video-control-play-btn video-control-play-btn__paused\"></div> </div> <div class=\"video-expand\"> <div class=\"video-expand-btn video-expand-btn__normal\"></div> </div> <div class=\"video-volume-ctrl\"> <div class=\"volume-total\"> <div class=\"ctrl volume-ctrl\"></div> <div class=\"volume-cur\"></div> </div> </div> <div class=\"video-volume\"> <div class=\"video-volume-btn video-volume-btn__muted\"></div> </div> </div> </div> <div class=\"vplayer-poster\"> <img alt=\"\"> </div> <div class=\"vplayer-play-btn\"></div> <img alt=\"\" class=\"vplayer-loading\" style=\"display: none\"> <div class=\"flash-tip\"> <a href=\"http://www.adobe.com/go/getflashplayer\" target=\"_blank\" title=\"升级Flash插件\"> 点击升级 Flash 插件 </a> </div> </div>";

var player$3 = {
	__def: player$2
};

var w = window;
var timers$1 = w.So && w.So.page && w.So.page.timer || [];

var timers = timers$1;
/*!    SWFObject v2.3.20130521 <http://github.com/swfobject/swfobject>
    is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/

/* global ActiveXObject: false */
/* jshint undef: true, unused: false */
/*jshint -W018 */
var swfobject = function() {

    var UNDEF = "undefined",
        OBJECT = "object",
        SHOCKWAVE_FLASH = "Shockwave Flash",
        SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
        FLASH_MIME_TYPE = "application/x-shockwave-flash",
        EXPRESS_INSTALL_ID = "SWFObjectExprInst",
        ON_READY_STATE_CHANGE = "onreadystatechange",

        win = window,
        doc = document,
        nav = navigator,

        plugin = false,
        domLoadFnArr = [],
        regObjArr = [],
        objIdArr = [],
        listenersArr = [],
        storedFbContent,
        storedFbContentId,
        storedCallbackFn,
        storedCallbackObj,
        isDomLoaded = false,
        isExpressInstallActive = false,
        dynamicStylesheet,
        dynamicStylesheetMedia,
        autoHideShow = true,
        encodeURIEnabled = false,

        /* Centralized function for browser feature detection
        - User agent string detection is only used when no good alternative is possible
        - Is executed directly for optimal performance
    */
        ua = function() {
            var w3cdom = typeof doc.getElementById !== UNDEF && typeof doc.getElementsByTagName !== UNDEF && typeof doc.createElement !== UNDEF,
                u = nav.userAgent.toLowerCase(),
                p = nav.platform.toLowerCase(),
                windows = p ? /win/.test(p) : /win/.test(u),
                mac = p ? /mac/.test(p) : /mac/.test(u),
                webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
                ie = nav.appName === "Microsoft Internet Explorer",
                playerVersion = [0, 0, 0],
                d = null;
            if (typeof nav.plugins !== UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] === OBJECT) {
                d = nav.plugins[SHOCKWAVE_FLASH].description;
                // nav.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                if (d && (typeof nav.mimeTypes !== UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) {
                    plugin = true;
                    ie = false; // cascaded feature detection for Internet Explorer
                    d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                    playerVersion[0] = toInt(d.replace(/^(.*)\..*$/, "$1"));
                    playerVersion[1] = toInt(d.replace(/^.*\.(.*)\s.*$/, "$1"));
                    playerVersion[2] = /[a-zA-Z]/.test(d) ? toInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1")) : 0;
                }
            } else if (typeof win.ActiveXObject !== UNDEF) {
                try {
                    var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                    if (a) { // a will return null when ActiveX is disabled
                        d = a.GetVariable("$version");
                        if (d) {
                            ie = true; // cascaded feature detection for Internet Explorer
                            d = d.split(" ")[1].split(",");
                            playerVersion = [toInt(d[0]), toInt(d[1]), toInt(d[2])];
                        }
                    }
                } catch (e) {}
            }
            return {
                w3: w3cdom,
                pv: playerVersion,
                wk: webkit,
                ie: ie,
                win: windows,
                mac: mac
            };
        }(),

        /* Cross-browser onDomLoad
        - Will fire an event as soon as the DOM of a web page is loaded
        - Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
        - Regular onload serves as fallback
    */
        onDomLoad = function() {
            if (!ua.w3) {
                return;
            }
            if ((typeof doc.readyState !== UNDEF && (doc.readyState === "complete" || doc.readyState === "interactive")) || (typeof doc.readyState === UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically
                callDomLoadFunctions();
            }
            if (!isDomLoaded) {
                if (typeof doc.addEventListener !== UNDEF) {
                    doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
                }
                if (ua.ie) {
                    doc.attachEvent(ON_READY_STATE_CHANGE, function detach() {
                        if (doc.readyState === "complete") {
                            doc.detachEvent(ON_READY_STATE_CHANGE, detach);
                            callDomLoadFunctions();
                        }
                    });
                    if (win == top) { // if not inside an iframe
                        (function checkDomLoadedIE() {
                            if (isDomLoaded) {
                                return;
                            }
                            try {
                                doc.documentElement.doScroll("left");
                            } catch (e) {
                                var _t = setTimeout(checkDomLoadedIE, 0);
                                timers.push(_t);
                                return;
                            }
                            callDomLoadFunctions();
                        }());
                    }
                }
                if (ua.wk) {
                    (function checkDomLoadedWK() {
                        if (isDomLoaded) {
                            return;
                        }
                        if (!/loaded|complete/.test(doc.readyState)) {
                            var _t = setTimeout(checkDomLoadedWK, 0);
                            timers.push(_t);
                            return;
                        }
                        callDomLoadFunctions();
                    }());
                }
            }
        }();

    function callDomLoadFunctions() {
        if (isDomLoaded || !document.getElementsByTagName("body")[0]) {
            return;
        }
        try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
            var t, span = createElement("span");
            span.style.display = "none"; //hide the span in case someone has styled spans via CSS
            t = doc.getElementsByTagName("body")[0].appendChild(span);
            t.parentNode.removeChild(t);
            t = null; //clear the variables
            span = null;
        } catch (e) {
            return;
        }
        isDomLoaded = true;
        var dl = domLoadFnArr.length;
        for (var i = 0; i < dl; i++) {
            domLoadFnArr[i]();
        }
    }

    function addDomLoadEvent(fn) {
        if (isDomLoaded) {
            fn();
        } else {
            domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
        }
    }

    /* Cross-browser onload
        - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
        - Will fire an event as soon as a web page including all of its assets are loaded
     */
    function addLoadEvent(fn) {
        if (typeof win.addEventListener !== UNDEF) {
            win.addEventListener("load", fn, false);
        } else if (typeof doc.addEventListener !== UNDEF) {
            doc.addEventListener("load", fn, false);
        } else if (typeof win.attachEvent !== UNDEF) {
            addListener(win, "onload", fn);
        } else if (typeof win.onload === "function") {
            var fnOld = win.onload;
            win.onload = function() {
                fnOld();
                fn();
            };
        } else {
            win.onload = fn;
        }
    }

    /* Detect the Flash Player version for non-Internet Explorer browsers
        - Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
          a. Both release and build numbers can be detected
          b. Avoid wrong descriptions by corrupt installers provided by Adobe
          c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
        - Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
    */
    function testPlayerVersion() {
        var b = doc.getElementsByTagName("body")[0];
        var o = createElement(OBJECT);
        o.setAttribute("style", "visibility: hidden;");
        o.setAttribute("type", FLASH_MIME_TYPE);
        var t = b.appendChild(o);
        if (t) {
            var counter = 0;
            (function checkGetVariable() {
                if (typeof t.GetVariable !== UNDEF) {
                    try {
                        var d = t.GetVariable("$version");
                        if (d) {
                            d = d.split(" ")[1].split(",");
                            ua.pv = [toInt(d[0]), toInt(d[1]), toInt(d[2])];
                        }
                    } catch (e) {
                        //t.GetVariable("$version") is known to fail in Flash Player 8 on Firefox
                        //If this error is encountered, assume FP8 or lower. Time to upgrade.
                        ua.pv = [8, 0, 0];
                    }
                } else if (counter < 10) {
                    counter++;
                    var _t = setTimeout(checkGetVariable, 10);
                    timers.push(_t);
                    return;
                }
                b.removeChild(o);
                t = null;
                matchVersions();
            }());
        } else {
            matchVersions();
        }
    }

    /* Perform Flash Player and SWF version matching; static publishing only
     */
    function matchVersions() {
        var rl = regObjArr.length;
        if (rl > 0) {
            for (var i = 0; i < rl; i++) { // for each registered object element
                var id = regObjArr[i].id;
                var cb = regObjArr[i].callbackFn;
                var cbObj = {
                    success: false,
                    id: id
                };
                if (ua.pv[0] > 0) {
                    var obj = getElementById(id);
                    if (obj) {
                        if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
                            setVisibility(id, true);
                            if (cb) {
                                cbObj.success = true;
                                cbObj.ref = getObjectById(id);
                                cbObj.id = id;
                                cb(cbObj);
                            }
                        } else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
                            var att = {};
                            att.data = regObjArr[i].expressInstall;
                            att.width = obj.getAttribute("width") || "0";
                            att.height = obj.getAttribute("height") || "0";
                            if (obj.getAttribute("class")) {
                                att.styleclass = obj.getAttribute("class");
                            }
                            if (obj.getAttribute("align")) {
                                att.align = obj.getAttribute("align");
                            }
                            // parse HTML object param element's name-value pairs
                            var par = {};
                            var p = obj.getElementsByTagName("param");
                            var pl = p.length;
                            for (var j = 0; j < pl; j++) {
                                if (p[j].getAttribute("name").toLowerCase() !== "movie") {
                                    par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                                }
                            }
                            showExpressInstall(att, par, id, cb);
                        } else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display fallback content instead of SWF
                            displayFbContent(obj);
                            if (cb) {
                                cb(cbObj);
                            }
                        }
                    }
                } else { // if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or fallback content)
                    setVisibility(id, true);
                    if (cb) {
                        var o = getObjectById(id); // test whether there is an HTML object element or not
                        if (o && typeof o.SetVariable !== UNDEF) {
                            cbObj.success = true;
                            cbObj.ref = o;
                            cbObj.id = o.id;
                        }
                        cb(cbObj);
                    }
                }
            }
        }
    }

    /* Main function
        - Will preferably execute onDomLoad, otherwise onload (as a fallback)
    */
    domLoadFnArr[0] = function() {
        if (plugin) {
            testPlayerVersion();
        } else {
            matchVersions();
        }
    };

    function getObjectById(objectIdStr) {
        var r = null,
            o = getElementById(objectIdStr);

        if (o && o.nodeName.toUpperCase() === "OBJECT") {
            //If targeted object is valid Flash file
            if (typeof o.SetVariable !== UNDEF) {
                r = o;
            } else {
                //If SetVariable is not working on targeted object but a nested object is
                //available, assume classic nested object markup. Return nested object.

                //If SetVariable is not working on targeted object and there is no nested object,
                //return the original object anyway. This is probably new simplified markup.

                r = o.getElementsByTagName(OBJECT)[0] || o;
            }
        }

        return r;
    }

    /* Requirements for Adobe Express Install
        - only one instance can be active at a time
        - fp 6.0.65 or higher
        - Win/Mac OS only
        - no Webkit engines older than version 312
    */
    function canExpressInstall() {
        return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
    }

    /* Show the Adobe Express Install dialog
        - Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
    */
    function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {

        var obj = getElementById(replaceElemIdStr);

        //Ensure that replaceElemIdStr is really a string and not an element
        replaceElemIdStr = getId(replaceElemIdStr);

        isExpressInstallActive = true;
        storedCallbackFn = callbackFn || null;
        storedCallbackObj = {
            success: false,
            id: replaceElemIdStr
        };

        if (obj) {
            if (obj.nodeName.toUpperCase() === "OBJECT") { // static publishing
                storedFbContent = abstractFbContent(obj);
                storedFbContentId = null;
            } else { // dynamic publishing
                storedFbContent = obj;
                storedFbContentId = replaceElemIdStr;
            }
            att.id = EXPRESS_INSTALL_ID;
            if (typeof att.width === UNDEF || (!/%$/.test(att.width) && toInt(att.width) < 310)) {
                att.width = "310";
            }
            if (typeof att.height === UNDEF || (!/%$/.test(att.height) && toInt(att.height) < 137)) {
                att.height = "137";
            }
            var pt = ua.ie ? "ActiveX" : "PlugIn",
                fv = "MMredirectURL=" + encodeURIComponent(win.location.toString().replace(/&/g, "%26")) + "&MMplayerType=" + pt + "&MMdoctitle=" + encodeURIComponent(doc.title.slice(0, 47) + " - Flash Player Installation");
            if (typeof par.flashvars !== UNDEF) {
                par.flashvars += "&" + fv;
            } else {
                par.flashvars = fv;
            }
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            if (ua.ie && obj.readyState != 4) {
                var newObj = createElement("div");
                replaceElemIdStr += "SWFObjectNew";
                newObj.setAttribute("id", replaceElemIdStr);
                obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
                obj.style.display = "none";
                removeSWF(obj); //removeSWF accepts elements now
            }
            createSWF(att, par, replaceElemIdStr);
        }
    }

    /* Functions to abstract and display fallback content
     */
    function displayFbContent(obj) {
        if (ua.ie && obj.readyState != 4) {
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            obj.style.display = "none";
            var el = createElement("div");
            obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the fallback content
            el.parentNode.replaceChild(abstractFbContent(obj), el);
            removeSWF(obj); //removeSWF accepts elements now
        } else {
            obj.parentNode.replaceChild(abstractFbContent(obj), obj);
        }
    }

    function abstractFbContent(obj) {
        var ac = createElement("div");
        if (ua.win && ua.ie) {
            ac.innerHTML = obj.innerHTML;
        } else {
            var nestedObj = obj.getElementsByTagName(OBJECT)[0];
            if (nestedObj) {
                var c = nestedObj.childNodes;
                if (c) {
                    var cl = c.length;
                    for (var i = 0; i < cl; i++) {
                        if (!(c[i].nodeType == 1 && c[i].nodeName === "PARAM") && !(c[i].nodeType == 8)) {
                            ac.appendChild(c[i].cloneNode(true));
                        }
                    }
                }
            }
        }
        return ac;
    }

    function createIeObject(url, paramStr) {
        var div = createElement("div");
        div.innerHTML = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='" + url + "'>" + paramStr + "</object>";
        return div.firstChild;
    }

    /* Cross-browser dynamic SWF creation
     */
    function createSWF(attObj, parObj, id) {
        var r, el = getElementById(id);
        id = getId(id); // ensure id is truly an ID and not an element

        if (ua.wk && ua.wk < 312) {
            return r;
        }

        if (el) {
            var o = (ua.ie) ? createElement("div") : createElement(OBJECT),
                attr,
                attrLower,
                param;

            if (typeof attObj.id === UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the fallback content
                attObj.id = id;
            }

            //Add params
            for (param in parObj) {
                //filter out prototype additions from other potential libraries and IE specific param element
                if (parObj.hasOwnProperty(param) && param.toLowerCase() !== "movie") {
                    createObjParam(o, param, parObj[param]);
                }
            }

            //Create IE object, complete with param nodes
            if (ua.ie) {
                o = createIeObject(attObj.data, o.innerHTML);
            }

            //Add attributes to object
            for (attr in attObj) {
                if (attObj.hasOwnProperty(attr)) { // filter out prototype additions from other potential libraries
                    attrLower = attr.toLowerCase();

                    // 'class' is an ECMA4 reserved keyword
                    if (attrLower === "styleclass") {
                        o.setAttribute("class", attObj[attr]);
                    } else if (attrLower !== "classid" && attrLower !== "data") {
                        o.setAttribute(attr, attObj[attr]);
                    }
                }
            }

            if (ua.ie) {
                objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
            } else {
                o.setAttribute("type", FLASH_MIME_TYPE);
                o.setAttribute("data", attObj.data);
            }

            el.parentNode.replaceChild(o, el);
            r = o;
        }

        return r;
    }

    function createObjParam(el, pName, pValue) {
        var p = createElement("param");
        p.setAttribute("name", pName);
        p.setAttribute("value", pValue);
        el.appendChild(p);
    }

    /* Cross-browser SWF removal
        - Especially needed to safely and completely remove a SWF in Internet Explorer
    */
    function removeSWF(id) {
        var obj = getElementById(id);
        if (obj && obj.nodeName.toUpperCase() === "OBJECT") {
            if (ua.ie) {
                obj.style.display = "none";
                (function removeSWFInIE() {
                    if (obj.readyState == 4) {
                        //This step prevents memory leaks in Internet Explorer
                        for (var i in obj) {
                            if (typeof obj[i] === "function") {
                                obj[i] = null;
                            }
                        }
                        obj.parentNode.removeChild(obj);
                    } else {
                        var _t = setTimeout(removeSWFInIE, 10);
                        timers.push(_t);
                    }
                }());
            } else {
                obj.parentNode.removeChild(obj);
            }
        }
    }

    function isElement(id) {
        return (id && id.nodeType && id.nodeType === 1);
    }

    function getId(thing) {
        return (isElement(thing)) ? thing.id : thing;
    }

    /* Functions to optimize JavaScript compression
     */
    function getElementById(id) {

        //Allow users to pass an element OR an element's ID
        if (isElement(id)) {
            return id;
        }

        var el = null;
        try {
            el = doc.getElementById(id);
        } catch (e) {}
        return el;
    }

    function createElement(el) {
        return doc.createElement(el);
    }

    //To aid compression; replaces 14 instances of pareseInt with radix
    function toInt(str) {
        return parseInt(str, 10);
    }

    /* Updated attachEvent function for Internet Explorer
        - Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
    */
    function addListener(target, eventType, fn) {
        target.attachEvent(eventType, fn);
        listenersArr[listenersArr.length] = [target, eventType, fn];
    }

    /* Flash Player and SWF content version matching
     */
    function hasPlayerVersion(rv) {
        rv += ""; //Coerce number to string, if needed.
        var pv = ua.pv,
            v = rv.split(".");
        v[0] = toInt(v[0]);
        v[1] = toInt(v[1]) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
        v[2] = toInt(v[2]) || 0;
        return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
    }

    /* Cross-browser dynamic CSS creation
        - Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
    */
    function createCSS(sel, decl, media, newStyle) {
        var h = doc.getElementsByTagName("head")[0];
        if (!h) {
            return;
        } // to also support badly authored HTML pages that lack a head element
        var m = (typeof media === "string") ? media : "screen";
        if (newStyle) {
            dynamicStylesheet = null;
            dynamicStylesheetMedia = null;
        }
        if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
            // create dynamic stylesheet + get a global reference to it
            var s = createElement("style");
            s.setAttribute("type", "text/css");
            s.setAttribute("media", m);
            dynamicStylesheet = h.appendChild(s);
            if (ua.ie && typeof doc.styleSheets !== UNDEF && doc.styleSheets.length > 0) {
                dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
            }
            dynamicStylesheetMedia = m;
        }
        // add style rule
        if (dynamicStylesheet) {
            if (typeof dynamicStylesheet.addRule !== UNDEF) {
                dynamicStylesheet.addRule(sel, decl);
            } else if (typeof doc.createTextNode !== UNDEF) {
                dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
            }
        }
    }

    function setVisibility(id, isVisible) {
        if (!autoHideShow) {
            return;
        }
        var v = isVisible ? "visible" : "hidden",
            el = getElementById(id);
        if (isDomLoaded && el) {
            el.style.visibility = v;
        } else if (typeof id === "string") {
            createCSS("#" + id, "visibility:" + v);
        }
    }

    /* Filter to avoid XSS attacks
     */
    function urlEncodeIfNecessary(s) {
        var regex = /[\\\"<>\.;]/;
        var hasBadChars = regex.exec(s) !== null;
        return hasBadChars && typeof encodeURIComponent !== UNDEF ? encodeURIComponent(s) : s;
    }

    /* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
     */
    var cleanup = function() {
        if (ua.ie) {
            window.attachEvent("onunload", function() {
                // remove listeners to avoid memory leaks
                var ll = listenersArr.length;
                for (var i = 0; i < ll; i++) {
                    listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
                }
                // cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
                var il = objIdArr.length;
                for (var j = 0; j < il; j++) {
                    removeSWF(objIdArr[j]);
                }
                // cleanup library's main closures to avoid memory leaks
                for (var k in ua) {
                    ua[k] = null;
                }
                ua = null;
                for (var l in swfobject) {
                    swfobject[l] = null;
                }
                swfobject = null;
            });
        }
    }();

    return {
        /* Public API
            - Reference: http://code.google.com/p/swfobject/wiki/documentation
        */
        registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
            if (ua.w3 && objectIdStr && swfVersionStr) {
                var regObj = {};
                regObj.id = objectIdStr;
                regObj.swfVersion = swfVersionStr;
                regObj.expressInstall = xiSwfUrlStr;
                regObj.callbackFn = callbackFn;
                regObjArr[regObjArr.length] = regObj;
                setVisibility(objectIdStr, false);
            } else if (callbackFn) {
                callbackFn({
                    success: false,
                    id: objectIdStr
                });
            }
        },

        getObjectById: function(objectIdStr) {
            if (ua.w3) {
                return getObjectById(objectIdStr);
            }
        },

        embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {

            var id = getId(replaceElemIdStr),
                callbackObj = {
                    success: false,
                    id: id
                };

            if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
                setVisibility(id, false);
                addDomLoadEvent(function() {
                    widthStr += ""; // auto-convert to string
                    heightStr += "";
                    var att = {};
                    if (attObj && typeof attObj === OBJECT) {
                        for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
                            att[i] = attObj[i];
                        }
                    }
                    att.data = swfUrlStr;
                    att.width = widthStr;
                    att.height = heightStr;
                    var par = {};
                    if (parObj && typeof parObj === OBJECT) {
                        for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
                            par[j] = parObj[j];
                        }
                    }
                    if (flashvarsObj && typeof flashvarsObj === OBJECT) {
                        for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
                            if (flashvarsObj.hasOwnProperty(k)) {

                                var key = (encodeURIEnabled) ? encodeURIComponent(k) : k,
                                    value = (encodeURIEnabled) ? encodeURIComponent(flashvarsObj[k]) : flashvarsObj[k];

                                if (typeof par.flashvars !== UNDEF) {
                                    par.flashvars += "&" + key + "=" + value;
                                } else {
                                    par.flashvars = key + "=" + value;
                                }

                            }
                        }
                    }
                    if (hasPlayerVersion(swfVersionStr)) { // create SWF
                        var obj = createSWF(att, par, replaceElemIdStr);
                        if (att.id == id) {
                            setVisibility(id, true);
                        }
                        callbackObj.success = true;
                        callbackObj.ref = obj;
                        callbackObj.id = obj.id;
                    } else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
                        att.data = xiSwfUrlStr;
                        showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                        return;
                    } else { // show fallback content
                        setVisibility(id, true);
                    }
                    if (callbackFn) {
                        callbackFn(callbackObj);
                    }
                });
            } else if (callbackFn) {
                callbackFn(callbackObj);
            }
        },

        switchOffAutoHideShow: function() {
            autoHideShow = false;
        },

        enableUriEncoding: function(bool) {
            encodeURIEnabled = (typeof bool === UNDEF) ? true : bool;
        },

        ua: ua,

        getFlashPlayerVersion: function() {
            return {
                major: ua.pv[0],
                minor: ua.pv[1],
                release: ua.pv[2]
            };
        },

        hasFlashPlayerVersion: hasPlayerVersion,

        createSWF: function(attObj, parObj, replaceElemIdStr) {
            if (ua.w3) {
                return createSWF(attObj, parObj, replaceElemIdStr);
            } else {
                return undefined;
            }
        },

        showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
            if (ua.w3 && canExpressInstall()) {
                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
            }
        },

        removeSWF: function(objElemIdStr) {
            if (ua.w3) {
                removeSWF(objElemIdStr);
            }
        },

        createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
            if (ua.w3) {
                createCSS(selStr, declStr, mediaStr, newStyleBoolean);
            }
        },

        addDomLoadEvent: addDomLoadEvent,

        addLoadEvent: addLoadEvent,

        getQueryParamValue: function(param) {
            var q = doc.location.search || doc.location.hash;
            if (q) {
                if (/\?/.test(q)) {
                    q = q.split("?")[1];
                } // strip question mark
                if (!param) {
                    return urlEncodeIfNecessary(q);
                }
                var pairs = q.split("&");
                for (var i = 0; i < pairs.length; i++) {
                    if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                        return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
                    }
                }
            }
            return "";
        },

        // For internal usage only
        expressInstallCallback: function() {
            if (isExpressInstallActive) {
                var obj = getElementById(EXPRESS_INSTALL_ID);
                if (obj && storedFbContent) {
                    obj.parentNode.replaceChild(storedFbContent, obj);
                    if (storedFbContentId) {
                        setVisibility(storedFbContentId, true);
                        if (ua.ie) {
                            storedFbContent.style.display = "block";
                        }
                    }
                    if (storedCallbackFn) {
                        storedCallbackFn(storedCallbackObj);
                    }
                }
                isExpressInstallActive = false;
            }
        },

        version: "2.3"

    };
}(); 

var swfobject_1 = swfobject;

var screenfull$1 = createCommonjsModule(function (module) {
(function () {
    'use strict';

    var isCommonjs = 'object' !== 'undefined' && module.exports;
    var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

    var fn = (function () {
        var val;
        var valLength;

        var fnMap = [
            [
                'requestFullscreen',
                'exitFullscreen',
                'fullscreenElement',
                'fullscreenEnabled',
                'fullscreenchange',
                'fullscreenerror'
            ],
            // new WebKit
            [
                'webkitRequestFullscreen',
                'webkitExitFullscreen',
                'webkitFullscreenElement',
                'webkitFullscreenEnabled',
                'webkitfullscreenchange',
                'webkitfullscreenerror'

            ],
            // old WebKit (Safari 5.1)
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
        ];

        var i = 0;
        var l = fnMap.length;
        var ret = {};

        for (; i < l; i++) {
            val = fnMap[i];
            if (val && val[1] in document) {
                for (i = 0, valLength = val.length; i < valLength; i++) {
                    ret[fnMap[0][i]] = val[i];
                }
                return ret;
            }
        }

        return false;
    })();

    var screenfull = {
        request: function (elem) {
            var request = fn.requestFullscreen;

            elem = elem || document.documentElement;

            // Work around Safari 5.1 bug: reports support for
            // keyboard in fullscreen even though it doesn't.
            // Browser sniffing, since the alternative with
            // setTimeout is even worse.
            if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
                elem[request]();
            } else {
                elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
            }
        },
        exit: function () {
            document[fn.exitFullscreen]();
        },
        toggle: function (elem) {
            if (this.isFullscreen) {
                this.exit();
            } else {
                this.request(elem);
            }
        },
        raw: fn
    };

    if (!fn) {
        if (isCommonjs) {
            module.exports = false;
        } else {
            window.screenfull = false;
        }

        return;
    }

    if (Object.defineProperties) {
        Object.defineProperties(screenfull, {
            isFullscreen: {
                get: function () {
                    return Boolean(document[fn.fullscreenElement]);
                }
            },
            element: {
                enumerable: true,
                get: function () {
                    return document[fn.fullscreenElement];
                }
            },
            enabled: {
                enumerable: true,
                get: function () {
                    // Coerce to boolean in case of old WebKit
                    return Boolean(document[fn.fullscreenEnabled]);
                }
            }
        });
    }

    if (isCommonjs) {
        module.exports = screenfull;
    } else {
        window.screenfull = screenfull;
    }
})();
});

var screenfull = screenfull$1;
var timers$3 = timers$1;

var ready = function ready(player, elem) {
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

            if (timer) {
                timers$3.push(timer);
            }
            last_call = curr;
        };
    }
};

var require$$2 = ( styles$1 && styles ) || styles$1;

var require$$3 = ( player$3 && player$2 ) || player$3;

var player = createCommonjsModule(function (module) {
var RESOURCE = config;
var loadCSS$$1 = loadCSS;
var cssText = require$$2;
loadCSS$$1(cssText.replace(/__sprite/g, RESOURCE.sprite));

var $template = $(require$$3);
var swfobject = swfobject_1;
var timers = timers$1;
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
    this.readyCalls = [ready];

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

    var hasFlash  = /^0{0,3}$/.test(swfobject.ua.pv.join('')) === false;
    var versionOK = swfobject.hasFlashPlayerVersion('11.4.0');

    if (!hasFlash || !versionOK) {
        this.$wrap.find('.flash-tip').show();
    } else {
        this.createPlayer();
    }
}

SwfPlayer.prototype = {
    constructor: SwfPlayer,
    /**
     * 对外暴露事件接口
     */
    on: function on(eventName, fn) {
        var this$1 = this;

        var events = eventName.split(/\s+/);
        for (var i = 0, len = events.length; i < len; i++) {
            EMITTER.on.call(EMITTER, events[i] + '_' + this$1.vid, fn);
        }
        return this;
    },

    off: function off(eventName, fn) {
        var this$1 = this;

        if (!eventName) {
            EMITTER.off();
        } else {
            var events = eventName.split(/\s+/);
            for (var i = 0, len = events.length; i < len; i++) {
                EMITTER.off.call(EMITTER, events[i] + '_' + this$1.vid, fn);
            }
        }
        return this;
    },

    /**
     * 生成 guid 
     */
    getVID: function getVID() {
        return 'vjs_' + (+new Date());
    },

    /**
     * 利用 swfobject.js 生成 flash 播放的 DOM 节点
     */
    createPlayer: function createPlayer() {
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

    track: function track(track$1) {
        try {
            if ($.isFunction(track$1)) {
                track$1();
            } else {
                var fn = new Function(track$1);
                fn();
            }
        } catch (e) {
            if (window.console) {
                window.console.log(e);
            }
        }
    },

    applyPlayTrack: function applyPlayTrack() {
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
    initEvents: function initEvents() {
        var this$1 = this;

        this.on('ready', function () {
            this$1.readyState = 'complete';
            this$1.vidElem = document.getElementById(this$1.vid);

            var readyCalls = this$1.readyCalls;
            for (var i = 0; i < readyCalls.length; i++) {
                readyCalls[i].call(this$1, this$1, this$1.vidElem);
            }
        });

        this.on('stageclick', function () {
            EMITTER.trigger('click_' + this$1.vid);
        });

        this.on('ended', function () {
            if (this$1.options.loop) {
                var _t = setTimeout(function () {
                    this$1.replay();
                }, 100);
                timers.push(_t);
            }
        });

        this.on('playing', function () {
            // 用于首次播放时的打点
            if (this$1.__not_first) {
                return;
            }
            this$1.__not_first = true;
            EMITTER.trigger('track_' + this$1.vid);
        });

        this.applyPlayTrack();
    },

    /**
     * onReady 添加回调
     */
    ready: function ready$$1(readyFunc) {
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
    setSource: function setSource(src) {
        this.vidElem.vjs_src(src);
        return this;
    },

    play: function play() {
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

    pause: function pause() {
        this.vidElem.vjs_pause();
        return this;
    },

    prop: function prop(name, value) {
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
});

return player;

})));
//# sourceMappingURL=bundle.js.map
