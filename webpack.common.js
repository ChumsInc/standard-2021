const path = require('path');

module.exports = {
    entry: './local-work/chums-theme.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: ['ts-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.join(__dirname, 'assets'),
        filename: "chums-theme.js",
        sourceMapFilename: 'chums-theme.js.map',
        publicPath: '/',
    },
    target: 'web',
}
