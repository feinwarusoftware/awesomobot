const merge = require('webpack-merge');

const baseConfig = require('./webpack.config');

module.exports = merge.smart(baseConfig, {
    mode: 'production'
});