// Local imports
import {
	LAYERS,
	Renderer,
} from './Renderer.js'
import { Entity } from './Entity.js'
import { GameManager } from './GameManager.js'





/**
 * Controller for all entities on a map.
 */
export class EntitiesManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#entities = []

	#gameManager = null





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * @param {object} options All options
	 * @param {GameManager} options.gameManager All options
	 */
	constructor(options) {
		const { gameManager } = options

		this.#gameManager = gameManager
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Add an entity to the controller.
	 *
	 * @param {Entity} entity The entity to be added.
	 */
	add(entity) {
		this.#entities.push(entity)
	}

	/**
	 * Renders all entities to a canvas.
	 *
	 * @param {Renderer} renderer The renderer to be used for drawing the map.
	 */
	render(renderer) {
		renderer.layer = LAYERS.sprites

		this.#entities.forEach(entity => {
			entity.render(renderer, this.#gameManager.tileset)
		})
	}

	/**
	 * Resets the manager.
	 */
	reset() {
		this.#entities = []
	}
}
