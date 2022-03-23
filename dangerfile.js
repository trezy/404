/* eslint-env node */

// Local imports
const { eslint } = require('./danger/eslint.js')





;(async() => {
	await eslint()
})()
