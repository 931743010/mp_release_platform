const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const webpackBaseConfig = require('./webpack.base.config')
const { ENV } = require('../lib/constants')

const config = {
  entry: {
    app: ENV.PATHS.CLIENT_ENTRY,
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/env',
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
            plugins: [
              [
                'component',
                {
                  libraryName: 'element-ui',
                  styleLibraryName: 'theme-chalk',
                },
              ],
            ],
          },
        }],
        include: /app/i,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          ENV.DEVELOPMENT ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer,
              ].concat(ENV.PRODUCTION ? [
                cssnano,
              ] : []),
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          ENV.DEVELOPMENT ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer,
              ].concat(ENV.PRODUCTION ? [
                cssnano,
              ] : []),
            },
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: ENV.PUBLIC_SCSS,
            },
          },
        ],
        include: /app/i,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
    }),
    new VueSSRClientPlugin(),
  ].concat(ENV.DEVELOPMENT ? [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css',
    }),
  ] : [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css',
    }),
  ]),
}

module.exports = webpackMerge.merge(webpackBaseConfig, config)
