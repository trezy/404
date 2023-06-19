// Module imports
import {
	AlphaFilter,
	ColorMatrixFilter,
	Container,
	Sprite,
} from 'pixi.js'





// Local imports
import { store } from '../newStore/store.js'





/**
 * Creates a Adds a map to the renderer.
 *
 * @param {import('../game/MapManager.js').MapManager} mapManager The map to be rendered.
 * @param {object} options All options.
 * @param {number} [options.alpha] The initial alpha value of tiles.
 * @param {string} [options.name] A name to be assigned to the map's container.
 * @returns {Container} An array of tilemaps representing the map's individual layers.
 */
export function renderMapToTilemap(mapManager, options = {}) {
	const {
		alpha = 1,
		name,
	} = options

	const { contentManager } = store.state

	const mapContainer = new Container

	if (name) {
		mapContainer.name = name
	}

	mapManager.graph.forEachNode(node => {
		const coordinateString = node.id
		const [x, y] = coordinateString.split('|').map(Number)

		/** @type {Container} */
		let targetContainer = mapContainer.getChildByName(coordinateString)

		if (!targetContainer) {
			targetContainer = new Container
			targetContainer.name = coordinateString
			targetContainer.filters = [
				new AlphaFilter(alpha),
				new ColorMatrixFilter,
			]
			mapContainer.addChild(targetContainer)
		}

		if (node.data.tileStack) {
			node.data.tileStack.forEach((tileData, layerIndex) => {
				const resourcepack = contentManager.getResourcepack(tileData.resourcepackID)
				const sprite = new Sprite(resourcepack.tilesSpritesheet.textures[tileData.tileID])

				sprite.x = x * 16
				sprite.y = y * 16

				targetContainer.addChildAt(sprite, layerIndex)
			})
		}
	})

	return mapContainer
}
