// Local imports
// import { cameraSystem } from './systems/cameraSystem.js'
import { controllerSystem } from './systems/controllerSystem.js'
import { initialisationSystem } from './systems/initialisationSystem.js'
import { moveSystem } from './systems/moveSystem.js'
// import { animationSystem } from './systems/animationSystem.js'
// import { sortSystem } from './systems/sortSystem.js'
import { store } from '../newStore/store.js'





/**
 * Updates the game logic and renders the camera.
 *
 * @returns {boolean} Whether the loop executed successfully.
 */
export function gameLoop() {
	const { isPaused } = store.state

	if (isPaused) {
		return true
	}

	store.set(() => ({ now: performance.now() }))

	initialisationSystem()
	controllerSystem()
	moveSystem()
	// animationSystem()
	// sortSystem()
	// cameraSystem()

	return true
}
