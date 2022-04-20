/* eslint-env node */
module.exports = [
	// Add native node modules support
	{
		// We're specifying native_modules in the test because the asset relocator loader generates a
		// 'fake' .node file which is really a cjs file.
		test: /native_modules\/.+\.node$/u,
		use: [
			'node-loader',
		],
	},
	{
		test: /\.(m?js|node)$/u,
		parser: { amd: false },
		use: {
			loader: '@vercel/webpack-asset-relocator-loader',
			options: {
				outputAssetBase: 'native_modules',
			},
		},
	},

	// Add SCSS support
	{
		test: /\.scss$/ui,
		use: [
			// Creates `style` nodes from JS strings
			'style-loader',
			// Translates CSS into CommonJS
			'css-loader',
			// Update static asset paths
			'resolve-url-loader',
			// Compiles Sass to CSS
			'sass-loader',
		],
	},

	// Add support for static files
	{
		test: /\.png$/u,
		use: [
			{
				loader: 'url-loader',
				options: {
					limit: 8 * 1024,
					name: '[hash]-[name].[ext]',
					outputPath: 'static',
					publicPath: '../static',
				},
			},
		],
	},

	// Add React support
	{
		test: /\.jsx?$/u,
		exclude: (() => {
			if (process.env.NODE_ENV === 'development') {
				return /node_modules/u
			}
		})(),
		use: [
			{
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
				},
			},
		],
	},
]
