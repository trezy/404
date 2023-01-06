/* eslint-env node */

// Module imports
import fs from 'node:fs/promises'
import path from 'node:path'





// Local imports
import { getAppDataPath } from './getAppDataPath.js'
import { getArchiveMeta } from './getArchiveMeta.js'





/**
 * Retrieves metadata for content.
 *
 * @param {string} directory The content directory of the archive.
 * @param {string} fileExtension The file extension of the archive.
 * @returns
 */
export async function getContentManifest(directory, fileExtension) {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const directoryContents = await fs.readdir(path.join(getAppDataPath(), directory))

	const archives = directoryContents.filter(item => {
		return path.extname(item) === fileExtension
	})

	const metadataPromises = archives.map(archive => {
		return getArchiveMeta(path.join(getAppDataPath(), directory, archive))
	})

	const manifest = []

	for await (const metadata of metadataPromises) {
		manifest.push(JSON.parse(metadata))
	}

	return manifest
}
