var prefix = ['webkit', 'Webkit', 'Moz', 'ms', 'O'];
var style = document.createElement('div').style;
var temp = '';
var noPrefix = 'transform' in style;

var transform = '';

if (noPrefix) {
  transform = 'transform';
}

for (var i = 0; !noPrefix && i < prefix.length; i++) {
  temp = prefix[i] ? (prefix[i] + 'Transform') : 'transform';

  if (temp in style) {
    transform = temp;
    break;
  }
}

module.exports = transform;
