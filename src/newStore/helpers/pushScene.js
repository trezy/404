// Local imports
import { store } from '../store.js'





/**
 * Adds a new scene to the history stack.
 *
 * @param {string} scene The key of the scene to be added.
 */
export function pushScene(scene) {
	if (!scene) {
		throw new Error('scene name is required')
	}

	store.set(previousState => ({
		sceneHistory: [
			...previousState.sceneHistory,
			scene,
		],
	}))
}
