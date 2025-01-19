const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',  // Main entry for your extension
    background: './src/background.ts',  // Add entry for background script
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',  // This will generate index.js and background.js
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',  // Use path.resolve to get absolute path
      filename: 'popup.html',  // Output as popup.html in dist/
    }),
    
    new webpack.HotModuleReplacementPlugin(),
  ],
};
