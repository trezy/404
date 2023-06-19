// Local imports
import { store } from '../store.js'





/**
 * Moves the cursor by the specified number of cells.
 *
 * @param {number} x The number of cells to move the cursor on the horizontal axis.
 * @param {number} y The number of cells to move the cursor on the vertical axis.
 */
export const moveCursor = (x, y) => {
	const { now } = store.state

	store.set(previousState => ({
		cursorOffset: {
			x: previousState.cursorOffset.x + x,
			y: previousState.cursorOffset.y + y,
		},
		lastCursorUpdate: now,
	}))
}
