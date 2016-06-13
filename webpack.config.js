var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
	entry: path.resolve(__dirname, 'app', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'app'),
		filename: 'index.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'ng-annotate!babel?presets[]=es2015',
				exclude: [/node_modules/, /lib/]
			},
			{
				test: /.html$/,
				loader: 'raw',
				exclude: [/node_modules/, /lib/]
			},
			{
				test: /.scss$/,
				loader: 'style!css!postcss-loader!sass',
				exclude: [/node_modules/, /lib/]
			}
		]
	},
	postcss: function() {
		return [require('autoprefixer')];
	}
};

if (process.env.NODE_ENV === 'development') {
}

if (process.env.NODE_ENV === 'production') {
	config.entry = path.resolve(__dirname, 'app', 'modal.js');
	config.output.path = path.resolve(__dirname, 'dist');
	config.output.libraryTarget = 'umd';
	config.devtool = 'source-map';
	// config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
