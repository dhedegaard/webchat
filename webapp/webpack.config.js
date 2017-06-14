const path = require('path');

module.exports = {
    entry: [
        'babel-polyfill',  // For Promise on IE.
        'whatwg-fetch',  // For fetch on IE.
        './index.js'
    ],
    output: {
        path: path.resolve('../webchat/static'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    }
}
