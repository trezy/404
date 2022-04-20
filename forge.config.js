/* eslint-env node */
// Module imports
const path = require('path')





module.exports = {
	packagerConfig: {
		asar: true,
	},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'debug',
			},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: [
				'darwin',
			],
		},
		{
			name: '@electron-forge/maker-deb',
			config: {},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {},
		},
	],
	plugins: [
		// ['@electron-forge/plugin-auto-unpack-natives', {}],
		['@electron-forge/plugin-webpack', {
			devContentSecurityPolicy: 'default-src \'self\' \'unsafe-inline\' data:; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\' data:; img-src \'self\' blob:',
			devServer: {
				liveReload: false,
				static: {
					directory: path.resolve(process.cwd(), 'public'),
					publicPath: '/static',
					serveIndex: true,
				},
			},
			mainConfig: './webpack.main.config.js',
			renderer: {
				config: './webpack.renderer.config.js',
				entryPoints: [
					{
						html: './src/index.html',
						js: './src/renderer.jsx',
						name: 'main_window',
						preload: {
							js: './src/preload.js',
						},
					},
				],
				nodeIntegration: true,
			},
		}],
	],
}
