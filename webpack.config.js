const path = require('path')
const { NODE_ENV } = process.env
const package = require('./package.json')
const filename = `${package.name}${NODE_ENV === 'production' ? '.min' : ''}.js`

module.exports = {
  mode: NODE_ENV || 'development',
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /^node_modules/,
        loader: 'babel-loader',
      },
    ],
  }
}
