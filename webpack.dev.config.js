const merge = require('webpack-merge');

const baseConfig = require('./webpack.config');

module.exports = merge.smart(baseConfig, {
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    devServer: {
        port: 1320,
        compress: true,
        noInfo: true,
        stats: 'errors-warnings',
        inline: true,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            disableDotRule: true,
            verbose: true,
        }
    }
});
