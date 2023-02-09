// Local imports
import { store } from '../store.js'





/**
 * Sets the renderer offset to a specific value.
 *
 * @param {number} x The new offset (in pixels) for the horizontal axis.
 * @param {number} y The new offset (in pixels) for the vertical axis.
 */
export const setGlobalOffset = (x, y) => {
	store.set(() => ({
		globalOffset: {
			x,
			y,
		}
	}))
}
