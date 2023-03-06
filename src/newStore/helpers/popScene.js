// Local imports
import { store } from '../store.js'





/**
 * Removes the last scene from the history stack.
 */
export function popScene() {
	store.set(previousState => {
		const { sceneHistory } = previousState

		return {
			sceneHistory: sceneHistory.slice(0, sceneHistory.length - 1),
		}
	})
}
