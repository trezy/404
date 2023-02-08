// Local imports
import { store } from '../store.js'





/**
 * Sets the renderer offset to a specific value.
 */
export const moveCursor = (x, y) => {
	store.set(state => ({
		cursorOffset: {
			x: state.cursorOffset.x + x,
			y: state.cursorOffset.y + y,
		}
	}))
}
