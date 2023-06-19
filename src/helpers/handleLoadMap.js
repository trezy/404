/* eslint-env node */

// Local imports
import { extractFileFromArchive } from './extractFileFromArchive.js'
import { STATE } from './state.js'





/**
 * Loads a map.
 *
 * @param {object} event The event object.
 * @param {string} mapID The ID of the map to load.
 * @returns {object} The map data.
 */
export async function handleLoadMap(event, mapID) {
	const mapMeta = Object
		.values(STATE.metaCache)
		.find(cacheItem => cacheItem.id === mapID)

	const mapData = await extractFileFromArchive(mapMeta.path, 'map.json')

	return JSON.parse(mapData.toString('utf8'))
}
