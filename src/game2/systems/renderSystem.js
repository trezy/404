// Local imports
import { store } from '../../newStore/store.js'
import { TILE_SIZE } from '../../game/Tile.js'
import { Vector2 } from '../structures/Vector2.js'
import { TileMapManager } from '../structures/TileMapManager.js'





/** Moves the robot. */
export function renderSystem() {
	const {
		currentTileset,
		cursorOffset,
		map,
		robot,
	} = store.state

	// Move the current tileset.
	if (currentTileset) {
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

		const conflicts = TileMapManager.findConflicts(currentTileset, map)

		currentTileset.graph.forEachNode(node => {
			const absolutePosition = Vector2.add(node.data.position, currentTileset.offset)

			const hasConflict = Boolean(conflicts.find(conflictPosition => Vector2.areEqual(conflictPosition, absolutePosition)))

			if (hasConflict) {
				currentTileset.markTileInvalid(node.data.position)
			} else {
				currentTileset.markTileValid(node.data.position)
			}
		})
	}

	robot.update()
}
