/* eslint-env node */

// Module imports
import path from 'node:path'





// Local imports
import { createArchive } from './createArchive.js'
import { getAppDataPath } from './getAppDataPath.js'





/**
 * Displays a save dialog, allowing the user to save a tileset to their filesystem.
 *
 * @param {object} event The event object.
 * @param {object} tilesetData A hash of the new tileset.
 * @returns {boolean} Whether the file was saved successfully.
 */
export async function handleSaveTileset(event, tilesetData) {
	const filePath = path.join(getAppDataPath(), 'tilesets', `${tilesetData.name}.debugtileset`)

	const result = {
		filePath,
		size: 0,
	}

	await createArchive(filePath, {
		'assets.json': JSON.stringify(tilesetData.assets),
		'tiles.json': JSON.stringify(tilesetData.tiles),
		'meta.json': JSON.stringify({
			name: tilesetData.name,
			version: '0.0.0-development',
		}),
	})

	return Boolean(result)
}
