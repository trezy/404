// Local imports
import { store } from '../store.js'





/**
 * Sets the renderer offset to a specific value.
 */
export const setGlobalOffset = (x, y) => {
	store.set(() => ({
		globalOffset: {
			x,
			y,
		}
	}))
}
