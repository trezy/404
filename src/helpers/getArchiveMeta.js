/* eslint-env node */

// Local imports
import { extractFileFromArchive } from './extractFileFromArchive.js'





/**
 * Retrieves metadata from an archive.
 *
 * @param {string} archivePath The absolute path of the archive.
 * @returns {Promise<object>} The archive's metadata.
 */
export function getArchiveMeta(archivePath) {
	return extractFileFromArchive(archivePath, 'meta.json')
}
