/* eslint-env node */

// Module imports
import { stat } from 'node:fs/promises'

// Local imports
import { extractFileFromArchive } from './extractFileFromArchive.js'





/**
 * Retrieves metadata from an archive.
 *
 * @param {string} archivePath The absolute path of the archive.
 * @returns {Promise<object>} The archive's metadata.
 */
export async function getArchiveMeta(archivePath) {
	const fileStat = await stat(archivePath)
	const metadataBuffer = await extractFileFromArchive(archivePath, 'meta.json')
	const metadata = JSON.parse(metadataBuffer.toString('utf8'))

	metadata.createdAt = fileStat.birthtime
	// eslint-disable-next-line security/detect-non-literal-regexp
	metadata.path = archivePath
	metadata.size = fileStat.size

	return metadata
}
