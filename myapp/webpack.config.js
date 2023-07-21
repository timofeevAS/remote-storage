const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        './client/js-bundle': './client/src/index.js'
    }, // path to our input file
    output: {
        filename: '[name].js', // output bundle file name
        path: path.resolve(__dirname, './'), // path to our Django static directory


    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-react"
                    ]
                }
            },
            {
                //exclude: /node_modules/,
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ],
            },

        ]
    },

    plugins: [
        //new BundleAnalyzerPlugin()
    ],
};