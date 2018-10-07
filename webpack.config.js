const webpack = require('webpack');
const {resolve} = require('path');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.MODE === 'PROD';

const cssFilename = '../../css/bundle/[name].css';

let plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
        },
        output: {
            comments: false,
        }
    }),
    new ExtractTextPlugin({ filename: cssFilename, disable: !isProd, allChunks: true }),
    new webpack.DefinePlugin({
        '__DEV__': !isProd,
        'process.env': {
            MODE: isProd ? JSON.stringify('PROD') : JSON.stringify('DEV')
        }
    }),
];

module.exports = {
    output: {
        path: resolve(__dirname, './public/javascripts/bundle/'),
        publicPath: '/javascripts/bundle/',
        filename: 'pwn.js',
        library: 'pwn',
        libraryTarget: 'umd'
    },
    entry: {
        'pwn': ['./src/index.js']
    },
    resolve: {
        extensions: ['.js'],
        modules: [
            resolve(__dirname, 'node_modules'),
            resolve(__dirname, 'src')
        ]
    },
    devServer: {
        port: process.env.DEV_SERVER_PORT || 3000
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },

                  {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: require.resolve('style-loader'),
          use: [{loader: require.resolve('css-loader'), options: {
            importLoaders: 1,
            minimize: true,
            sourceMap: true,
          }}]
        })
      },
      {
        test: /\.scss$/,
        include: [
          resolve(__dirname, "style"),
          resolve(__dirname, 'node_modules'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: require.resolve('style-loader'),
          use: [{loader: require.resolve('css-loader')}, {loader: require.resolve('sass-loader'),
          options: {
            importLoaders: 1,
            minimize: true,
            sourceMap: true,
          }}]
        })
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=400000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader' ,
        options: {
            outputPath: 'media/'
          }
      },
        ]
    },
    plugins
};