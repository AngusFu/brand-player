import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import html from 'rollup-plugin-html';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

// for css imports
import { renderSync } from 'node-sass';
import { createFilter } from 'rollup-pluginutils';
const cssFilter = createFilter(['**/*.css', '**/*.scss', '**/*.sass']);

// fix Object.freeze AND keyword `default`
// see https://github.com/futurist/rollup-plugin-es3/blob/master/index.js
let es3Fix = {
  removeHash: {
    'freeze': [/Object.freeze\s*\(\s*([^)]*)\)/g, '$1'],
    // default: "bar" -> "default": "bar"
    'default_1': [/([{,]\s*)default\s*:/g, '$1__def:'],
    // literal property []
    'default_2': [/(['"])default\1/g, '$1__def$1'],
    // foo.default -> foo["default"]
    'default_3': [/\.default([\.\s]*)/g, '["__def"]$1']
  },
  transformBundle: function (code) {
    let rmHash = this.removeHash;
    for (var k in rmHash) {
      code = code.replace(rmHash[k][0], rmHash[k][1]);
    }
    return { code, map: { mappings: '' } };
  }
};

const config = {
  entry: 'js/player.js',
  dest: 'dist/bundle.js',
  format: 'umd',
  context: 'window',
  moduleName: 'vPlayer',
  sourceMap: true,
  plugins: [
    html({
      htmlMinifierOptions: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        minifyJS: true
      }
    }),
    {
      transform(code, id) {
        if (!cssFilter(id)) {
          return;
        }

        let css = renderSync({
          data: code,
          outputStyle: 'compressed'
        }).css.toString();

        return {
          code: 'export default ' + JSON.stringify(css),
          map: { mappings: '' }
        };
      }
    },
    resolve({
      main: true,
      browser: true,
      extensions: ['.js']
    }),
    commonjs(),
    es3Fix
  ]
};


let IS_WATCHING_MODE = Array.from(process.argv).includes('-w');
let isBrowserOpened = false;
if (IS_WATCHING_MODE) {
  config.plugins = config.plugins.concat([
    serve({
      contentBase: __dirname,
      historyApiFallback: true,
      port: 10001
    }),
    livereload({
      watch: __dirname
    }),
    {
      ongenerate() {
        console.log('opening http://localhost:10001 in browser');
        if (!isBrowserOpened) {
          require('opn')('http://localhost:10001');
        }
        isBrowserOpened = true;
      }
    }
  ]);
} else {
  config.plugins.push(uglify({}, minify));
}

export default config;