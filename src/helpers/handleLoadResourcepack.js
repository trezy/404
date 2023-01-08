/* eslint-env node */

// Local imports
import { extractFileFromArchive } from './extractFileFromArchive.js'
import { STATE } from './state.js'





/**
 * Loads a resourcepack.
 *
 * @param {object} event The event object.
 * @param {string} resourcepackID The ID of the resourcepack to load.
 * @returns {boolean} TODO
 */
export async function handleLoadResourcepack(event, resourcepackID) {
	const resourcepackMeta = Object
		.values(STATE.metaCache)
		.find(cacheItem => cacheItem.id === resourcepackID)

	const tileDataString = await extractFileFromArchive(resourcepackMeta.path, 'tiles.json')

	return JSON.parse(tileDataString)
}
