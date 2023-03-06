// Local imports
import { store } from '../store.js'





/**
 * Retrieves the current scene from the history stack.
 *
 * @param {string} scene The key of the scene to switch to.
 * @param {object} [options] Additional keys to be set in the state.
 */
export function getCurrentScene({ sceneHistory }) {
	return sceneHistory[sceneHistory.length - 1]
}
