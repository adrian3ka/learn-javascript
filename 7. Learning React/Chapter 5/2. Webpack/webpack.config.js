var webpack = require("webpack");

module.exports = {
    entry: __dirname + "/src/index.jsx",
    output: {
        path: __dirname + "/dist/assets",
        filename: "bundle.js",
        sourceMapFilename: 'bundle.map'
    },
    devtool: '#source-map',
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'stage-0', 'react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [require('autoprefixer')]
                    }
                }]
            }
        ]
    },
    optimization: {
        minimize: true //Update this to true or false
    },
    mode: 'development'
}
