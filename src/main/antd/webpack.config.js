// 得到 webpack
const webpack = require('@souche-f2e/atool-build/lib/webpack');

module.exports = function(webpackConfig) {
    // 添加一个plugin
    // webpackConfig.plugins.push(
    //     new webpack.DefinePlugin({
    //     __DEV__: JSON.stringify('true')
    //     })
    // );
    // 返回 webpack 配置对象
    webpackConfig.devtool = 'eval-souce-map';
    return webpackConfig;
};
