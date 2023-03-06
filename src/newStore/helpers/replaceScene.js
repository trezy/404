// Local imports
import { store } from '../store.js'





/**
 * Replaces the current scene.
 *
 * @param {string} scene The key of the scene to replace with.
 */
export function replaceScene(scene) {
	if (!scene) {
		throw new Error('scene name is required')
	}

	store.set(previousState => {
		const { sceneHistory } = previousState

		const newSceneHistory = sceneHistory.slice(0, sceneHistory.length - 1)
		newSceneHistory.push(scene)

		return {
			sceneHistory: newSceneHistory,
		}
	})
}
