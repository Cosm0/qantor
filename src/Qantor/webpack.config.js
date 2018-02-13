const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = (env) => {
    const devBuild = !(env && env.production);

    const vendorModules = [
        'react',
        'react-dom',
        'react-router-dom',
        'styled-components',
        'immutable',
        'dateformat',
        'babel-polyfill',
        'babel-plugin-transform-object-rest-spread'
    ];
    
    const sharedConfig = () => ({
        entry: ({
            main: './Client/startup.js',
            vendor: vendorModules
        }),
        output: {
            filename: './bundle.js',
            path: path.resolve(__dirname, 'wwwroot/js')
        },
        devtool: 'source-map',
        resolve: {
            modules: [
                path.resolve('./'),
                path.resolve('./node_modules')
            ]
        },
        plugins: [
            new CommonsChunkPlugin({ name: "vendor", filename: "vendor.bundle.js" })
        ],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'env', 'stage-3']
                    }
                }
            ]
        }
    });

    return devBuild === true ? webpackMerge(sharedConfig(), {
    }) : webpackMerge(sharedConfig(), {
        plugins: [new UglifyJsPlugin({ sourceMap: false })]
    });
};
