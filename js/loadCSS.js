module.exports = function (cssText) {
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
