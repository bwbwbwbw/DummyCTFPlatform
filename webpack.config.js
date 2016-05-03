var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var extractProjectCSS = new ExtractTextPlugin('dummyctf.css', { allChunks: true });
var extractVendorCSS = new ExtractTextPlugin('vendors.css', { allChunks: true });
var postcssAutoprefixerPlugin = require('autoprefixer');

var root = function (fn) {
  return path.resolve(__dirname, fn);
};

var config = {
  context: root('ui'),
  entry: {
    dummyctf: './Entry.js',
  },
  output: {
    path: root('.uibuild'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  resolve: {
    root: [root('node_modules'), root('ui')],
    extensions: ['.js', ''],
    unsafeCache: true,
  },
  devtool: 'source-map',
  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        loader: 'eslint',
        exclude: /node_modules\//,
      }
    ],
    loaders: [
      {
        // fonts
        test: /\.(ttf|eot|svg|woff|woff2)(\?.*)?$/,
        loader: 'file',
      },
      {
        // images
        test: /\.(png|jpg)$/,
        loader: 'url?limit=4024',
      },
      {
        // ES2015 scripts
        test: /\.js$/,
        exclude: /node_modules\//,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-0'],
        },
      },
      {
        // JSON files
        test: /\.json$/,
        exclude: /node_modules\//,
        loader: 'json'
      },
      {
        // vendors stylesheets
        test: /\.css$/,
        include: /node_modules\//,
        loader: StringReplacePlugin.replace(extractVendorCSS.extract(['css']),
        {
          replacements: [{
            pattern: /\@import url\(https\:\/\/fonts\.googleapis\.com\/[^\)]*\);/gi,
            replacement: function () { return ''; },
          }]
        }),
      },
      {
        // project stylesheets
        test: /\.css$/,
        exclude: /node_modules\//,
        loader: extractProjectCSS.extract(['css', 'postcss']),
      },
      {
        // project stylus stylesheets
        test: /\.styl$/,
        loader: extractProjectCSS.extract(['css', 'postcss', 'stylus']),
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),

    // extract 3rd-party libraries into a standalone file
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', function (module, count) {
      return module.resource && module.resource.indexOf(root('ui/')) === -1;
    }),

    // extract stylesheets into a standalone file
    extractProjectCSS,
    extractVendorCSS,

    // remove Google Fonts from vendor CSS
    new StringReplacePlugin(),

    // copy static assets
    new CopyWebpackPlugin([{ to: 'static', from: root('ui/static') }]),
  ],
  postcss: function () {
    return [postcssAutoprefixerPlugin];
  },
  stats: {
    children: false,
  },
  eslint: {
    configFile: root('.eslintrc.yml'),
  },
};

module.exports = config;
