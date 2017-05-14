module.exports = {
    context: __dirname + '/src',
    entry: './scripts/index.js',
    output: {
        path: __dirname,
        filename: './dist/scripts/index.js'
    },
    module: {
        loaders: [
            {
                loader: "babel-loader",
                query: {
                    presets: ['stage-0', 'es2015']
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};