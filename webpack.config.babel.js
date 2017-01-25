import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import fs from 'fs';

import { PATHS, gamification } from './config';
import path from 'path';

let nodeModules = {};

fs
  .readdirSync('node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => nodeModules[mod] = 'commonjs ' + mod);

let TARGET;
switch (process.env.npm_lifecycle_event) {
  case 'test':
    TARGET = 'test'
    break;
  case 'build':
  case 'stats':
    TARGET = 'production'
    break;
  default:
    TARGET = 'dev'
}

export default {
  entry: {
    app: [PATHS.app]
  },
  target: 'node',
  output: {
    path: PATHS.dist,
    filename: '[name].js'
  },
  externals: nodeModules,
  resolve: {
    alias: {
      Config: path.resolve('./config')
    }
  },
  devtool: 'sourcemap',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.json$/,
        exclude: /node_modules/,
        use: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(TARGET)
      }
    }),
    new CleanWebpackPlugin([PATHS.dist]),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ]
};
