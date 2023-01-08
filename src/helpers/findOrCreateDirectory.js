// Module imports
import fs from 'node:fs/promises'





/**
 * Attempts to locate a directory, then creates the directory if it doesn't yet exist.
 *
 * @param {string} directoryPath The path to the directory.
 */
export async function findOrCreateDirectory(directoryPath) {
	try {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		await fs.readdir(directoryPath)
	} catch (readdirError) {
		try {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			await fs.mkdir(directoryPath, { recursive: true })

		// eslint-disable-next-line no-empty
		} catch (mkdirError) {
			console.log(mkdirError)
		}
	}
}
