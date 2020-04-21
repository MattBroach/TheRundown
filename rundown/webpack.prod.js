const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name]-[hash].css",
    }),
    new webpack.DefinePlugin({
      EBS_BASE_URL: JSON.stringify(process.env.EBS_BASE_URL || 'http://localhost:8000/'),
    }),
  ]
});
