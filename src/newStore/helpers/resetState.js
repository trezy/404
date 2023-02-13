// Local imports
import { store } from '../store.js'





// Local imports
import { initialState } from '../initialState.js'





/**
 * Resets the store to its default state.
 */
export const resetState = () => {
	store.set(state => {
		return {
			...initialState,
			keyboardLayoutMap: state.keyboardLayoutMap,
		}
	})
}
