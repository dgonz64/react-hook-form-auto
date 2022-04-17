const path = require('path')
const { NODE_ENV } = process.env
const { merge } = require('webpack-merge')
const package = require('./package.json')

const commonConfig = ({ mode, minimize }) => {
  return {
    mode,
    devtool: 'source-map',
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
    },
    optimization: { minimize }
  }
}

const webConfig = ({ minAdd }) => {
  const webFilename = `${package.name}${minAdd}.js`

  return {
    entry: [
      './src/index.js',
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: webFilename,
      libraryTarget: 'umd',
    },
    externals: {
      'react': 'react'
    }
  }
}

const reactBaseConfig = ({ minAdd }) => {
  const baseFilename = `base${minAdd}.js`

  return {
    entry: [
      './src/index_base.js',
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: baseFilename,
      libraryTarget: 'umd',
    },
    externals: {
      'react': 'react',
      'react-native': 'react-native',
      'react-hook-form': 'react-hook-form'
    },
  }
}

module.exports = (env = {}) => {
  const { mode } = env
  const isBase = env.buildtype == 'base'
  const isProduction = mode == 'production'
  const minimize = env.minify == 'true'
  const minAdd = isProduction ? '.min' : ''

  const common = commonConfig({ mode, minimize })
  const mergeWith = isBase ?
    reactBaseConfig({ minAdd }) : webConfig({ minAdd })

  return merge([ common, mergeWith ])
}
