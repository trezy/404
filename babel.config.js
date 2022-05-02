/* eslint-env node */
const { version: electronVersion } = require('electron/package.json')

const developmentPlugins = [require.resolve('react-refresh/babel')]
const productionPlugins = []

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
