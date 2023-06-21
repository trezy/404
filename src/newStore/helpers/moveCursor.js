// Local imports
import { Vector2 } from '../../game2/structures/Vector2.js'
import { store } from '../store.js'





/**
 * Moves the cursor by the specified number of cells.
 *
 * @param {number} x The number of cells to move the cursor on the horizontal axis.
 * @param {number} y The number of cells to move the cursor on the vertical axis.
 */
export const moveCursor = (x, y) => {
	const { currentTileset } = store.state

	if (!currentTileset) {
		return
	}

	store.set(previousState => {
		const newX = previousState.cursorOffset.x + x
		const newY = previousState.cursorOffset.y + y

		previousState.currentTileset.offset = new Vector2(newX, newY)

		return {
			cursorOffset: {
				x: newX,
				y: newY,
			},
			lastCursorUpdate: previousState.now,
		}
	})
}
