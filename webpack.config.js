const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
    pixi = path.join(phaserModule, 'build/custom/pixi.js'),
    p2 = path.join(phaserModule, 'build/custom/p2.js');

const config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            { test: /pixi.js/, loader: "script" }
        ]
    },
    resolve: {
        alias: {
            Phaser: phaser,
            'pixi.js': pixi,
            'p2': p2,
        }
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ]
};

module.exports = config;