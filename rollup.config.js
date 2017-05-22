import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';
import html from 'rollup-plugin-html';
// import uglify from 'rollup-plugin-uglify';
// import { minify } from 'uglify-js';

// for css imports
import { renderSync } from 'node-sass';
import { createFilter } from 'rollup-pluginutils';
const cssFilter = createFilter(['**/*.css', '**/*.scss', '**/*.sass']);
let cssCompressRollupPlugin = {
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
};

// fix Object.freeze AND keyword `default`
// see https://github.com/futurist/rollup-plugin-es3/blob/master/index.js
let es3FixRollupPlugin = {
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

// browser sync
// Docs: http://www.browsersync.cn/docs/api/
let browserSyncRolluPlugin = {
  client: require('browser-sync').create(),
  clientState: 0,

  clientInit() {
    let bs = this.client;
    bs.init({
      server: './',
      open: 'local',
      https: true
    });
    bs.watch('*.html').on('change', bs.reload);
    
    this.clientState = 1;
  },

  clientReload() {
    this.client.reload(['./dist/bundle.js']);
  },

  ongenerate() {
    if (this.clientState === 0) {
      this.clientInit();
    } else {
      this.clientReload();
    }
  }
};

let IS_WATCHING_MODE = Array.from(process.argv).includes('-w');

export default {
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
    cssCompressRollupPlugin,
    buble(),
    resolve({
      main: true,
      browser: true,
      extensions: ['.js']
    }),
    commonjs(),
    es3FixRollupPlugin,
    IS_WATCHING_MODE ? browserSyncRolluPlugin : {}// : uglify({}, minify)
  ]
};
