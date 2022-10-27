const { defineConfig } = require('webpack-config-copilot')
const path = require('path')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const { DefinePlugin, ProvidePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const jsReg = /\.(js|jsx|ts|tsx)$/
const nodeModulesReg = /node_modules/
const [cssReg, cssModuleReg] = [/\.css$/, /\.module.css$/]
const [scssReg, scssModuleReg] = [/\.scss$/, /\.module.scss$/]
const [lessReg, lessModuleReg] = [/\.less$/, /\.module.less$/]
const svgReg = /\.(svg)(\?.*)?$/
const fontReg = /\.(woff2?|eot|ttf|otf)(\?.*)?$/i
const imageReg = /\.(png|jpe?g|gif|webp)(\?.*)?$/

const srcEntry = path.resolve(__dirname, 'src')
const outputDir = path.resolve(__dirname, 'dist')
const indexHtmlPath = path.resolve(__dirname, 'public/index.html')
const publicDirPath = path.resolve(__dirname, 'public')

const isDev = process.env.NODE_ENV === 'development'
const isOpenAnalyzer = false
const isOpenFilesystemCache = true

const webpackCache = isOpenFilesystemCache
  ? defineConfig({
      cache: {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      },
    })
  : {}
const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader
const cssLoader = 'css-loader'
const scssLoader = 'sass-loader'
const lessLoader = {
  loader: 'less-loader',
  options: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
}
const postcssConfigFile = path.resolve(__dirname, 'postcss.config.js')
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      config: postcssConfigFile,
    },
  },
}
const cssLoaderModulesOption = {
  getLocalIdent: getCSSModuleLocalIdent,
}
const publicPath = isDev
  ? '/'
  : '//cdn.jsdelivr.net/gh/opq-osc/opqbot-notify@gh-pages/'

const { name } = require('./package')
// html title
const title = name
const isOpenLocalDebugMicroApp = process.env.MICRO_MODE === 'true'
const isMicroAppDev = isDev && !isOpenLocalDebugMicroApp

// load env
loadEnv()

module.exports = defineConfig({
  entry: srcEntry,
  output: {
    path: outputDir,
    filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    publicPath: publicPath,
    chunkFilename: isDev
      ? 'js/[name].chunk.js'
      : 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[name].[hash][ext]',
    ...(isMicroAppDev
      ? {}
      : {
          library: `${name}-[name]`,
          libraryTarget: 'umd',
          globalObject: 'window',
          chunkLoadingGlobal: `webpackJsonp_${name}`,
        }),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@': srcEntry,
    },
  },
  module: {
    rules: getRules(),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
    }),
    new ProvidePlugin({
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      template: indexHtmlPath,
      title,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: publicDirPath,
          to: outputDir,
          toType: 'dir',
          globOptions: {
            ignore: [indexHtmlPath],
          },
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : 'css/[name].[contenthash].css',
      chunkFilename: isDev ? '[id].css' : 'css/[id].[contenthash].css',
    }),
    new ProgressBarPlugin(),
    isOpenAnalyzer && new BundleAnalyzerPlugin(),
    isDev && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  optimization: {
    minimize: !isDev,
    minimizer: !isDev
      ? [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              format: {
                comments: false,
              },
              compress: {
                drop_console: true,
              },
            },
          }),
          new CssMinimizerPlugin(),
        ]
      : [],
    splitChunks: getSplitChunksConfig(['react']),
  },
  devtool: isDev ? 'eval-cheap-module-source-map' : false,
  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    historyApiFallback: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    ...(isMicroAppDev
      ? {
          hot: true,
        }
      : {
          hot: false,
          liveReload: false,
        }),
  },
  target: 'web',
  stats: 'errors-warnings',
  ...webpackCache,
})

function loadEnv() {
  const dotenv = require('dotenv')
  dotenv.config({ path: path.resolve(__dirname, '.env') })
  dotenv.config({
    path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
  })
}

function getSplitChunksConfig(needExtractDepsName = []) {
  const depsSplit = {}

  needExtractDepsName.forEach((depName) => {
    depsSplit[depName] = {
      name: `chunk-${depName}`,
      priority: 20,
      test: new RegExp(`[\\/]node_modules[\\/]_?${depName}(.*)`),
    }
  })

  return {
    chunks: 'all',
    cacheGroups: {
      libs: {
        name: 'chunk-libs',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        chunks: 'initial',
      },
      commons: {
        name: 'chunk-commons',
        test: path.resolve(__dirname, 'src/components'),
        minChunks: 3,
        priority: 5,
        reuseExistingChunk: true,
      },
      ...depsSplit,
    },
  }
}

function getRules() {
  return [
    // js / ts
    {
      test: jsReg,
      loader: 'babel-loader',
      exclude: nodeModulesReg,
    },
    // css
    {
      test: cssReg,
      exclude: cssModuleReg,
      use: [
        styleLoader,
        {
          loader: cssLoader,
          options: {
            importLoaders: 1,
          },
        },
        postcssLoader,
      ],
    },
    // css module
    {
      test: cssModuleReg,
      use: [
        styleLoader,
        {
          loader: cssLoader,
          options: {
            importLoaders: 1,
            modules: cssLoaderModulesOption,
          },
        },
        postcssLoader,
      ],
    },
    // scss
    {
      test: scssReg,
      exclude: scssModuleReg,
      use: [
        styleLoader,
        {
          loader: cssLoader,
          options: {
            importLoaders: 2,
          },
        },
        postcssLoader,
        scssLoader,
      ],
    },
    // scss module
    {
      test: scssModuleReg,
      use: [
        styleLoader,
        {
          loader: cssLoader,
          options: {
            importLoaders: 2,
            modules: cssLoaderModulesOption,
          },
        },
        postcssLoader,
        scssLoader,
      ],
    },
    // less
    {
      test: lessReg,
      exclude: lessModuleReg,
      use: [
        styleLoader,
        {
          loader: cssLoader,
          options: {
            importLoaders: 2,
          },
        },
        postcssLoader,
        lessLoader,
      ],
    },
    // less module
    {
      test: lessModuleReg,
      use: [
        styleLoader,
        {
          loader: cssLoader,
          options: {
            importLoaders: 2,
            modules: cssLoaderModulesOption,
          },
        },
        postcssLoader,
        lessLoader,
      ],
    },
    // svg
    {
      test: svgReg,
      use: ['@svgr/webpack'],
    },
    // image
    {
      test: imageReg,
      type: 'asset/resource',
    },
    // font
    {
      test: fontReg,
      type: 'asset/resource',
    },
  ]
}
