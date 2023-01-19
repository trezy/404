// Module imports
import {
	schedule,
	unschedule,
} from 'rafael'





// Local imports
import { ContentManager } from './ContentManager.js'
import { ControlsManager } from './ControlsManager.js'
import { EntitiesManager } from './EntitiesManager.js'
import { Entity } from './Entity.js'
import { MapManager } from './MapManager.js'
import { Renderer } from './Renderer.js'
import { store } from '../store/index.js'





/**
 * The core controller for the game.
 */
export class GameManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#contentManager = null

	#controlsManager = null

	#entitiesManager = null

	#mapManager = null

	#renderer = null

	#robot = null

	#tileset = null





	/****************************************************************************\
	 * Public instance properties
	\****************************************************************************/

	/**
	 * The main game loop. Calls all major per-frame update functions in the correct order.
	 */
	gameLoop = () => {
		const {
			isRunning,
			nextFrame,
		} = store.getState()

		if (isRunning) {
			nextFrame()

			this.#controlsManager.update()
			this.#robot.update()

			this.#renderer.drawGrid(this.#mapManager.width, this.#mapManager.height)
			this.#mapManager.render(this.#renderer)
			this.#entitiesManager.render(this.#renderer)

			this.#renderer.update()
		}
	}

	/**
	 * Start the game manager.
	 */
	start = () => {
		unschedule('game loop')
		schedule(this.gameLoop, { id: 'game loop' })

		this.#renderer.initialise()

		this.#robot = new Entity({
			isAnimated: true,
			mapManager: this.#mapManager,
			position: { ...this.#mapManager.startingPosition },
		})
		this.#entitiesManager.add(this.#robot)
		this.#robot.go()

		store.setState({ isRunning: true })

		// window.addEventListener('dblclick', this.handleDoubleClick)
	}

	/**
	 * Stop the game manager.
	 */
	stop = () => {
		store.setState({ isRunning: false })

		this.#renderer.disconnectResizeObserver()
		this.#entitiesManager.reset()

		unschedule('game loop')
	}

	// handleDoubleClick = () => {
	// 	if (document.fullscreenElement) {
	// 		document.exitFullscreen()
	// 	} else {
	// 		this.canvas.requestFullscreen()
	// 	}
	// }





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new `GameManager`
	 */
	constructor() {
		this.#contentManager = new ContentManager
		this.#controlsManager = new ControlsManager
		this.#entitiesManager = new EntitiesManager({ gameManager: this })
		this.#renderer = new Renderer
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Loads a map.
	 *
	 * @param {string} mapID The ID of the map to be loaded.
	 */
	async loadMap(mapID) {
		const map = await this.contentManager.loadMap(mapID)

		this.#mapManager = new MapManager({
			gameManager: this,
			map,
		})

		await this.preloadTileset()

		store.setState({ mapManager: this.#mapManager })
	}

	/**
	 * Preload the tileset.
	 */
	async preloadTileset() {
		if (!this.#tileset) {
			this.#tileset = new Image

			this.#tileset.src = '/static/tileset.png'

			await this.#tileset.decode()
		}
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {ContentManager} The `GameManager`'s `ContentManager`.
	 */
	get contentManager() {
		return this.#contentManager
	}

	/**
	 * @returns {ControlsManager} The `GameManager`'s `ControlsManager`.
	 */
	get controlsManager() {
		return this.#controlsManager
	}

	/**
	 * @returns {ControlsManager} The `GameManager`'s `ControlsManager`.
	 */
	get controlsManager() {
		return this.#controlsManager
	}

	/**
	 * @returns {MapManager} The current `MapManager`.
	 */
	get mapManager() {
		return this.#mapManager
	}

	/**
	 * @returns {Renderer} The `GameManager`'s `Renderer`.
	 */
	get renderer() {
		return this.#renderer
	}

	/**
	 * @returns {HTMLImageElement} The current tileset.
	 */
	get tileset() {
		return this.#tileset
	}
}
