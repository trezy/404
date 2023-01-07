/* eslint-env node */

// Module imports
import path from 'node:path'
import { v4 as uuid } from 'uuid'





// Local imports
import { createArchive } from './createArchive.js'
import { getAppDataPath } from './getAppDataPath.js'
import { STATE } from './state.js'





/**
 * Displays a save dialog, allowing the user to save a tileset to their filesystem.
 *
 * @param {object} event The event object.
 * @param {object} tilesetData A hash of the new tileset.
 * @returns {boolean} Whether the file was saved successfully.
 */
export async function handleSaveTileset(event, tilesetData) {
	const filePath = path.join(getAppDataPath(), 'resourcepacks', `${tilesetData.name}.debugresourcepack`)
	const id = tilesetData.id || uuid()

	const result = {
		filePath,
		id,
		size: 0,
	}

	await createArchive(filePath, {
		'assets.json': JSON.stringify(tilesetData.assets),
		'tiles.json': JSON.stringify(tilesetData.tiles),
		'meta.json': JSON.stringify({
			id,
			name: tilesetData.name,
			type: 'resourcepacks',
			version: '0.0.0-development',
		}),
	})

	STATE.contentWatcher.add(filePath)

	return Boolean(result)
}
