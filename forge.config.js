/* eslint-env node */
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
		{
			name: '@electron-forge/plugin-auto-unpack-natives',
			config: {},
		},
		{
			name: '@electron-forge/plugin-webpack',
			config: {
				devContentSecurityPolicy: 'default-src \'self\' \'unsafe-inline\' data:; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\' data:; img-src \'self\' blob: data:',
				devServer: {
					client: { overlay: false },
					liveReload: false,
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
			},
		},
	],
}
