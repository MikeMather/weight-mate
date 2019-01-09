const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./src/app.js",
    mode: 'production',
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        },
        {
            test: /\.s?css$/,
            use: [
                "style-loader", 
                "css-loader",
                "sass-loader"
            ]
        }]
    },
    //devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, '/build'),
        historyApiFallback: true,
        disableHostCheck: true
    },
    plugins: [
        new UglifyJsPlugin(),
    ],
    optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	}
};
