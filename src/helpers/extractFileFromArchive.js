/* eslint-env node */

// Module imports
import Zip from 'adm-zip'





/**
 * Parses an archive to get a list of all files within it.
 *
 * @param {string} archivePath Absolute path to the archive to be parsed.
 * @param {string} filename The name of the file to be extracted from the archive.
 * @returns {Promise<string[]>} A manifest of the files included in the archive.
 */
export function extractFileFromArchive(archivePath, filename) {
	const zip = new Zip(archivePath)

	return new Promise(resolve => {
		const entry = zip.getEntry(filename)
		zip.readAsTextAsync(entry, resolve)
	})
}
