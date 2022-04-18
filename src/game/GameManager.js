// Module imports
import {
	schedule,
	unschedule,
} from 'rafael'





// Local imports
import { ControlsManager } from './ControlsManager.js'
import { Renderer } from './Renderer.js'
import { store } from '../store/index.js'





/**
 * The core controller for the game.
 */
export class GameManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#controlsManager = null

	#renderer = null





	/****************************************************************************\
	 * Public instance properties
	\****************************************************************************/

	/**
	 * The main game loop. Calls all major per-frame update functions in the correct order.
	 */
	gameLoop = () => {
		const {
			isRunning,
			mapManager,
			nextFrame,
		} = store.getState()

		if (isRunning) {
			nextFrame()

			this.controlsManager.update()
			this.#renderer.drawGrid(mapManager.width, mapManager.height)
			mapManager.render(this.#renderer)

			// render.drawEntities(entities)

			// if (currentTile < mapManager.tiles.length) {
			// 	render.drawPlacement()
			// }

			this.#renderer.update()
		}
	}

	// handleDoubleClick = () => {
	// 	if (document.fullscreenElement) {
	// 		document.exitFullscreen()
	// 	} else {
	// 		this.canvas.requestFullscreen()
	// 	}
	// }

	/**
	 * Start the game manager.
	 */
	start = () => {
		schedule(this.gameLoop, { id: 'game loop' })

		if (!isRunning) {
			this.#renderer = new Renderer

			store.setState({ isRunning: true })

			// window.addEventListener('dblclick', this.handleDoubleClick)
	}

	/**
	 * Stop the game manager.
	 */
	stop = () => {
		const { isRunning } = store.getState()

		if (isRunning) {
			store.setState({ isRunning: false })
			this.#renderer.disconnectResizeObserver()

		unschedule('game loop')
		}
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new `GameManager`
	 */
	constructor() {
		this.#controlsManager = new ControlsManager
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * Retrieves the `ControlsManager` being used by this `GameManager`.
	 *
	 * @returns {ControlsManager} The `GameManager`'s `ControlsManager`.
	 */
	get controlsManager() {
		return this.#controlsManager
	}

	/**
	 * Retrieves the `Renderer` being used by this `GameManager`.
	 *
	 * @returns {Renderer} The `GameManager`'s `Renderer`.
	 */
	get renderer() {
		return this.#renderer
	}
}
