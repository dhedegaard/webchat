const path = require('path');

module.exports = {
    entry: [
        'babel-polyfill',  // For Promise on IE.
        'whatwg-fetch',  // For fetch on IE.
        './index.tsx'
    ],
    output: {
        path: path.resolve('../webchat/static'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.tsx?$/, loader: ['babel-loader', 'ts-loader'], exclude: /node_modules/ }
        ]
    }
};
