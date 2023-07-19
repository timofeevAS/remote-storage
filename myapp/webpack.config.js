const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  // The base directory (absolute path) for resolving the entry option
  context: path.resolve(__dirname),
  // Entry point of your application
  entry: './client/src/index.js',

  output: {
  // Where bundles will be stored
  path: path.resolve(__dirname, 'client', 'bundles').substring(0, path.resolve(__dirname, 'client', 'bundles').lastIndexOf('\\')),
  filename: '[name]-[hash].js',
},

  plugins: [
    // Tells webpack where to store data about your bundles.
    new BundleTracker({ filename: path.join(__dirname, 'webpack-stats.json') }),
    // Makes jQuery available in every module
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],

  module: {
    rules: [
      // Transpiles .js and .jsx files using Babel
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      // Handles CSS files
      {
        test: /^(?!.*?\.module).*\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      // Handles image files
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource',
      },
      // Handles font files
      {
        test: /\.(woff|woff2|tff|eot|svg)$/,
        type: 'asset/inline',
      },
    ],
  },

  resolve: {
    // Tells webpack where to look for modules
    modules: ['node_modules'],
    // Extensions that should be used to resolve modules
    extensions: ['.js', '.jsx'],
  },
};
