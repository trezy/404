// Module imports
import {
	AlphaFilter,
	ColorMatrixFilter,
} from 'pixi.js'





// Local imports
import { store } from '../../newStore/store.js'
import { TILE_SIZE } from '../../game/Tile.js'
import { Vector2 } from '../structures/Vector2.js'





/** Moves the robot. */
export function moveSystem() {
	const {
		currentTileset,
		cursorOffset,
		map,
	} = store.state

	if (!currentTileset) {
		return
	}

	const target = new Vector2(
		cursorOffset.x * TILE_SIZE.width,
		cursorOffset.y * TILE_SIZE.height,
	)

	if ((target.x === currentTileset.sprite.x) && (target.y === currentTileset.sprite.y)) {
		return
	}

	currentTileset.sprite.x = target.x
	currentTileset.sprite.y = target.y
	currentTileset.offset = new Vector2(cursorOffset.x, cursorOffset.y)

	currentTileset.graph.forEachNode(node => {
		const { position } = node.data

		const target = new Vector2(
			(currentTileset.sprite.x / TILE_SIZE.width) + position.x,
			(currentTileset.sprite.y / TILE_SIZE.height) + position.y,
		)

		const sourceSpritePosition = Vector2.fromString(node.id)
		const targetNode = map.getNodeAt(target)
		const sourceSprite = currentTileset.getSpriteAt(sourceSpritePosition)

		if (sourceSprite) {
			if (targetNode?.data.isBlocking || targetNode?.data.isTraversable) {
				currentTileset.markTileInvalid(sourceSpritePosition)
			} else {
				currentTileset.markTileValid(sourceSpritePosition)
			}
		}
	})
}
