'use strict';

const path = require('path');

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.jsx', '.js', '.json']
    },
    devtool: 'source-map',
    plugins: [
    ]
};