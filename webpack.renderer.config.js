/* eslint-env node */
// Module imports
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')





// Local imports
const rules = require('./webpack.rules.js')





rules.push({
	test: /\.css$/,
	use: [
		{ loader: 'style-loader' },
		{
			loader: 'css-loader',
			options: {
				modules: true,
			},
		},
	],
})

rules.push({
	test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/u,
	type: 'asset',
})

rules.push({
	test: /\.(gif|jpe?g|png|svg|webp)$/u,
	type: 'asset',
})

module.exports = {
	target: 'electron-renderer',

	module: {
		rules,
	},

	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'public'),
					to: path.resolve(__dirname, '.webpack', 'renderer', 'static'),
				},
			],
		}),
	],
}
