/* eslint-env node */

// Module imports
import { stat } from 'node:fs/promises'

// Local imports
import { extractFileFromArchive } from './extractFileFromArchive.js'
import { getAppDataPath } from './getAppDataPath.js'





/**
 * Retrieves metadata from an archive.
 *
 * @param {string} archivePath The absolute path of the archive.
 * @returns {Promise<object>} The archive's metadata.
 */
export async function getArchiveMeta(archivePath) {
	const fileStat = await stat(archivePath)
	const metadataString = await extractFileFromArchive(archivePath, 'meta.json')
	const metadata = JSON.parse(metadataString)

	metadata.createdAt = fileStat.birthtime
	// eslint-disable-next-line security/detect-non-literal-regexp
	metadata.path = archivePath.replace(new RegExp(`^${getAppDataPath()}\\/?`, 'u'), '')
	metadata.size = fileStat.size

	return metadata
}
