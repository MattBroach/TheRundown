const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    config: './src/js/config.js',
    viewer: './src/js/viewer.js',
  },
  module: {
    rules: [
      { 
        test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ 
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Extension',
      template: 'src/html/viewer.html',
      filename: 'video_overlay.html',
      chunks: ['viewer'],
    }),
    new HtmlWebpackPlugin({
      title: 'Extension config',
      template: 'src/html/config.html',
      filename: 'config.html',
      chunks: ['config'],
    }),
    new HtmlWebpackPlugin({
      title: 'Extension Live Config',
      template: 'src/html/config.html',
      filename: 'live_config.html',
      chunks: ['config'],
    }),
  ],
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};
