// Local imports
// import { cameraSystem } from './systems/cameraSystem.js'
import { controllerSystem } from './systems/controllerSystem.js'
import { initialisationSystem } from './systems/initialisationSystem.js'
import { moveSystem } from './systems/moveSystem.js'
import { pathfindingSystem } from './systems/pathfindingSystem.js'
import { renderSystem } from './systems/renderSystem.js'
import { store } from '../newStore/store.js'
import { timeSystem } from './systems/timeSystem.js'





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

	timeSystem()
	initialisationSystem()
	controllerSystem()
	pathfindingSystem()
	moveSystem()
	renderSystem()
	// cameraSystem()

	return true
}
