/* global danger, warn, fail, markdown */
/* eslint-env node */

// Module imports
const { ESLint } = require('eslint')
const path = require('path')





// Constants
const filesToLint = [
	...danger.git.created_files,
	...danger.git.modified_files,
].map(filePath => path.resolve(filePath))
const linter = new ESLint





/**
 * ESLint formatter for writing ESLint warnings and errors to Danger.
 *
 * @param {*} results Results from linting files.
 */
function format(results) {
	const messageHandlers = {
		1: warn,
		2: fail,
	}
	const messageCounts = {
		errors: 0,
		fixableErrors: 0,
		fixableWarnings: 0,
		warnings: 0,
	}

	const markdownArray = ['<details>']

	markdownArray.push('<summary><h2>Full ESLint results</h2></summary>')

	results.forEach(fileResults => {
		const {
			errorCount,
			filePath,
			fixableErrorCount,
			fixableWarningCount,
			messages,
			warningCount,
		} = fileResults

		messageCounts.errors += errorCount
		messageCounts.fixableErrors += fixableErrorCount
		messageCounts.fixableWarnings += fixableWarningCount
		messageCounts.warnings += warningCount

		if (!messages.length) {
			return
		}

		if (!filesToLint.includes(filePath)) {
			return
		}

		markdownArray.push(`<h3><code>${filePath}</code></h3>`)
		markdownArray.push('<table>')
		markdownArray.push('<tbody>')

		messages.forEach(finding => {
			const {
				fatal,
				line,
				message,
				ruleId,
				severity,
			} = finding

			const column = Number.isNaN(finding.column) ? 0 : finding.column

			const messageHandler = messageHandlers[severity]

			if (fatal) {
				fail(`Fatal error linting ${filePath} with eslint.`)
			}

			messageHandler(`${filePath} line ${line} – ${message} (${ruleId})`)

			markdownArray.push('<tr>')
			markdownArray.push(`<td><code>${line}:${column}</code></td>`)
			markdownArray.push(`<td><code>${severity === 1 ? 'warning' : 'error'}</code></td>`)
			markdownArray.push(`<td>${message}</td>`)
			markdownArray.push(`<td><code>${ruleId}</code></td>`)
			markdownArray.push('</tr>')
		})

		markdownArray.push('</tbody>')
		markdownArray.push('</table>')
	})

	markdownArray.push('<h3>Summary</h3>')
	markdownArray.push(`${messageCounts.errors + messageCounts.warnings} problems (${messageCounts.errors} error${(messageCounts.errors === 1) ? '' : 's'}, ${messageCounts.warnings} warning${(messageCounts.warnings === 1) ? '' : 's'})`)
	markdownArray.push(`${messageCounts.fixableErrors} error${(messageCounts.fixableErrors === 1) ? '' : 's'} and ${messageCounts.fixableWarnings} warning${(messageCounts.fixableWarnings === 1) ? '' : 's'} potentially fixable with the \`--fix\` option.`)

	markdownArray.push('</details>')

	if ((messageCounts.errors + messageCounts.warnings) > 0) {
		markdown(markdownArray.join('\n'))
	}
}

/**
 * Runs ESLint and reports the results with Danger.
 */
module.exports.eslint = async function eslint() {
	const results = await linter.lintFiles(['./src/**/*.{js,jsx}'])

	format(results)
}
