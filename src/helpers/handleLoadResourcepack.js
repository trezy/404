/* eslint-env node */

// Local imports
import { extractFileFromArchive } from './extractFileFromArchive.js'
import { STATE } from './state.js'





/**
 * Loads a resourcepack.
 *
 * @param {object} event The event object.
 * @param {string} resourcepackID The ID of the resourcepack to load.
 * @param {boolean} includeAssets Whether to includes assets when loading this resourcepack.
 * @returns {object} The resourcepack's tile data.
 */
export async function handleLoadResourcepack(event, resourcepackID, includeAssets) {
	const resourcepackMeta = Object
		.values(STATE.metaCache)
		.find(cacheItem => cacheItem.id === resourcepackID)

	const promises = [extractFileFromArchive(resourcepackMeta.path, 'tiles.json')]

	if (includeAssets) {
		promises.push(extractFileFromArchive(resourcepackMeta.path, 'assets.json'))
	}

	const [
		tileDataString,
		assetDataString,
	] = await Promise.all(promises)

	return {
		assets: includeAssets ? JSON.parse(assetDataString) : null,
		tiles: JSON.parse(tileDataString),
	}
}
