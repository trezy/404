// Module imports
import {
	schedule,
	unschedule,
} from 'rafael'





// Local imports
import { advanceFrame } from '../newStore/helpers/advanceFrame.js'
import { EntitiesManager } from './EntitiesManager.js'
import { Entity } from './Entity.js'
import { MapManager } from './MapManager.js'
import { Renderer } from './Renderer.js'
import { resetState } from '../newStore/helpers/resetState.js'
import { setIsRunning } from '../newStore/helpers/setIsRunning.js'
import { store } from '../newStore/store.js'
import { store as zustandStore } from '../store/index.js'
import { winMap } from '../newStore/helpers/winMap.js'





/**
 * The core controller for the game.
 */
export class GameManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#entitiesManager = null

	#mapManager = null

	#renderer = null

	#robot = null

	#tileset = null





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	#checkForVictoryCondition() {
		const isVictory = this.mapManager.destinations.some(destination => {
			const xMatch = this.#robot.position.x === destination.x
			const yMatch = this.#robot.position.y === destination.y

			return xMatch && yMatch
		})

		if (isVictory) {
			this.pause()
			winMap()
		}
	}





	/****************************************************************************\
	 * Public instance properties
	\****************************************************************************/

	/**
	 * The main game loop. Calls all major per-frame update functions in the correct order.
	 */
	gameLoop = () => {
		const {
			isRunning,
			timer,
		} = store.state

		if (isRunning) {
			advanceFrame()

			if (!timer.isInGracePeriod) {
				this.#robot.update()
			}

			// this.#renderer.drawGrid(this.#mapManager.width, this.#mapManager.height)
			// this.#mapManager.render(this.#renderer)
			// this.#entitiesManager.render(this.#renderer)

			// this.#renderer.update()

			timer.update()

			this.#checkForVictoryCondition()
		}
	}

	/**
	 * Pause the game.
	 */
	pause = () => {
		setIsRunning(false)
	}

	/**
	 * Start the game manager.
	 */
	start = () => {
		const { timer } = store.state

		unschedule('game loop')

		resetState()

		store.set(() => ({ mapManager: this.#mapManager }))

		schedule(this.gameLoop, { id: 'game loop' })

		this.#renderer.initialise()

		this.#robot = new Entity({
			isAnimated: true,
			mapManager: this.#mapManager,
			position: { ...this.#mapManager.startingPosition },
		})
		this.#entitiesManager.add(this.#robot)

		timer.start(10000)
		setIsRunning(true)
	}

	/**
	 * Stop the game manager.
	 */
	stop = () => {
		const { timer } = store.state

		setIsRunning(false)

		timer.stop()
		this.#renderer.disconnectResizeObserver()
		this.#entitiesManager.reset()

		unschedule('game loop')
	}

	/**
	 * Unpause the game.
	 */
	unpause = () => {
		setIsRunning(true)
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new `GameManager`
	 */
	constructor() {
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
		const { contentManager } = store.state

		const map = await contentManager.loadMap(mapID)

		this.#mapManager = new MapManager({ map })

		await this.preloadTileset()

		zustandStore.setState({ mapManager: this.#mapManager })
		store.set(() => ({ mapManager: this.#mapManager }))
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
