var webpack = require('webpack');
var isProd = process.argv[2] == void 0;
var plugins = [];

isProd && plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = {
  devtool: isProd ? 'source-map' : 'inline-source-map',
  entry: './js/player.js',
  output: {
    path: './dist/',
    filename: "bundle.js"
  },

  resolve: {
    extensions: ['', '.js', '.css', '.html']
  },

  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'raw'
    }, {
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /\.png$/,
      loader: 'file?name=[hash:6].[ext]'
    }]
  },

  plugins: plugins
};
