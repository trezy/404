/* eslint-env node */
const { version: electronVersion } = require('electron/package.json')

const developmentPlugins = [
	[
		require.resolve('@babel/plugin-proposal-decorators'),
		{ version: '2022-03' },
	],
	require.resolve('react-refresh/babel'),
]
const productionPlugins = [[
	require.resolve('@babel/plugin-proposal-decorators'),
	{ version: '2022-03' },
]]

// eslint-disable-next-line jsdoc/require-jsdoc
module.exports = api => {
	api.cache.using(() => process.env.NODE_ENV)

	const isDev = !api.env('production')

	return {
		exclude: [
			/node_modules/u,
		],
		presets: [
			['@babel/preset-env', {
				targets: {
					electron: electronVersion,
				},
				useBuiltIns: false,
			}],
			['@babel/preset-react', {
				development: isDev,
				runtime: 'automatic',
			}],
		],
		plugins: isDev ? developmentPlugins : productionPlugins,
		sourceType: 'unambiguous',
	}
}
