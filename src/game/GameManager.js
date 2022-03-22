// Local imports
import { Renderer } from './Renderer.js'
import { store } from '../store/index.js'





/**
 * The core controller for the game.
 */
export class GameManager {
	/****************************************************************************\
	 * Private properties
	\****************************************************************************/

	#renderer = null





	/****************************************************************************\
	 * Public properties
	\****************************************************************************/

	controls = null
	isRunning = true





	/****************************************************************************\
	 * Public methods
	\****************************************************************************/

	/**
	 * The main game loop. Calls all major per-frame update functions in the correct order.
	 */
	gameLoop = () => {
		const {
			isRunning,
			map,
			nextFrame,
		} = store.getState()

		if (isRunning) {
			nextFrame()

			this.renderer.drawGrid(map.width, map.height)
			map.render(this.renderer)

			// render.drawEntities(entities)

			// if (currentTile < map.tiles.length) {
			// 	render.drawPlacement()
			// }

			this.renderer.update()

			requestAnimationFrame(this.gameLoop)
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
		const { isRunning } = store.getState()

		if (!isRunning) {
			store.setState({ isRunning: true })

			// window.addEventListener('dblclick', this.handleDoubleClick)

			this.gameLoop()
		}
	}

	/**
	 * Stop the game manager.
	 */
	stop = () => {
		const { isRunning } = store.getState()

		if (isRunning) {
			store.setState({ isRunning: false })
		}
	}





	/****************************************************************************\
	 * Public methods
	\****************************************************************************/

	/**
	 * Retrieves the `Renderer` being used by this `GameManager`.
	 *
	 * @returns {Renderer} The `GameManager`'s `Renderer`.
	 */
	get renderer() {
		if (!this.#renderer) {
			this.#renderer = new Renderer
		}

		return this.#renderer
	}
}
