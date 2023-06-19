// Module imports
import {
	AlphaFilter,
	ColorMatrixFilter,
} from 'pixi.js'





// Local imports
import { store } from '../../newStore/store.js'
import { TILE_SIZE } from '../../game/Tile.js'





/** Moves the robot. */
export function moveSystem() {
	const {
		cursorOffset,
		mapManager,
		viewport,
	} = store.state

	if (!mapManager.tileset) {
		return
	}

	const tilesetContainer = viewport.getChildByName('tileset')

	if (!tilesetContainer) {
		return
	}

	const target = {
		x: cursorOffset.x * TILE_SIZE.width,
		y: cursorOffset.y * TILE_SIZE.height,
	}

	if ((target.x === tilesetContainer.x) && (target.y === tilesetContainer.y)) {
		return
	}

	tilesetContainer.x = cursorOffset.x * TILE_SIZE.width
	tilesetContainer.y = cursorOffset.y * TILE_SIZE.height

	mapManager.tileset.graph.forEachNode(node => {
		const {
			x,
			y,
		} = node.data

		const targetX = (tilesetContainer.x / TILE_SIZE.width) + x
		const targetY = (tilesetContainer.y / TILE_SIZE.height) + y

		const targetCoordinateString = `${targetX}|${targetY}`
		const targetNode = mapManager.graph.getNode(targetCoordinateString)
		const targetSprite = tilesetContainer.getChildByName(node.id)

		if (targetSprite) {
			/** @type {ColorMatrixFilter} */
			const alphaFilter = targetSprite.filters.find(filter => filter instanceof AlphaFilter)
			const colorMatrixFilter = targetSprite.filters.find(filter => filter instanceof ColorMatrixFilter)

			if (targetNode?.data.isBlocking || targetNode?.data.isTraversable) {
				colorMatrixFilter.tint(0xff0000, true)
				alphaFilter.alpha = 1
			} else {
				alphaFilter.alpha = 0.5
				colorMatrixFilter.reset()
			}
		}
	})
}
