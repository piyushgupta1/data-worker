var path = require("path");
var webpack = require("webpack");
const pkg = require("./package.json");
const libraryName = "data-worker";
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./src/data-worker.ts",
    module: {
        rules: [{
            test: /\.ts?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    externals: ["d3-array", "d3-collection"],
    output: {
        filename: pkg.main,
        path: path.resolve(__dirname),
        library: libraryName,
        libraryTarget: "umd",
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
    optimization: {
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: true,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: true
            })
        ]
    }
};