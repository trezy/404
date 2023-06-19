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
	const response = {}

	const resourcepackMeta = Object
		.values(STATE.metaCache)
		.find(cacheItem => cacheItem.id === resourcepackID)

	if (resourcepackMeta.tilesData) {
		const [
			tilesData,
			tilesImage,
		] = await Promise.all([
			extractFileFromArchive(resourcepackMeta.path, resourcepackMeta.tilesData),
			extractFileFromArchive(resourcepackMeta.path, resourcepackMeta.tilesImage),
		])

		response.tilesData = JSON.parse(tilesData.toString('utf8'))
		response.tilesImage = `data:image/png;base64,${tilesImage.toString('base64')}`
	}

	if (resourcepackMeta.robotsData) {
		const [
			robotsData,
			robotsImage,
		] = await Promise.all([
			extractFileFromArchive(resourcepackMeta.path, resourcepackMeta.robotsData),
			extractFileFromArchive(resourcepackMeta.path, resourcepackMeta.robotsImage),
		])

		response.robotsData = JSON.parse(robotsData.toString('utf8'))
		response.robotsImage = `data:image/png;base64,${robotsImage.toString('base64')}`
	}

	if (includeAssets) {
		const assetData = await extractFileFromArchive(resourcepackMeta.path, 'assets.json')
		response.assetData = JSON.parse(assetData.toString('utf8'))
	}

	return response
}
