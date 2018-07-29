var path = require('path');
var webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/Game.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'game.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
