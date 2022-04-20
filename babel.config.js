/* eslint-env node */
const { version: electronVersion } = require('electron/package.json')

const developmentEnvironments = ['development', 'test']

// const developmentPlugins = ['react-hot-loader/babel']
// const productionPlugins = []

// eslint-disable-next-line jsdoc/require-jsdoc
module.exports = api => {
	// eslint-disable-next-line no-unused-vars
	const isDev = api.env(developmentEnvironments)

	return {
		presets: [
			['@babel/preset-env', {
				targets: {
					electron: electronVersion,
				},
				useBuiltIns: false,
			}],
			['@babel/preset-react', {
				runtime: 'automatic',
			}],
		],
		// plugins: [...(isDev ? developmentPlugins : productionPlugins)],
		sourceType: 'unambiguous',
	}
}
