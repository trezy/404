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
			controls: state.controls,
			contentManager: state.contentManager,
			controlsManager: state.controlsManager,
			gameManager: state.gameManager,
			keyboardLayoutMap: state.keyboardLayoutMap,
			sceneHistory: state.sceneHistory,
		}
	})
}
