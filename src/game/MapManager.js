// Local imports
import {
	LAYERS,
	Renderer,
} from './Renderer.js'
import {
	TILE_RENDERERS,
	TILE_SIZE,
} from './Tile.js'
import { GameManager } from './GameManager.js'





/**
 * Represents a game map.
 */
export class MapManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#gameManager = null

	#mapData = null

	#mapID = null





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new map.
	 *
	 * @param {object} options All options.
	 * @param {GameManager} options.gameManager The `GameManager` this map belongs to.
	 * @param {string} options.mapID The ID of this map.
	 */
	// constructor(mapData, tileset) {
	constructor(options) {
		const {
			gameManager,
			mapID,
		} = options

		this.#gameManager = gameManager
		this.#mapID = mapID
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Load the data for this map.
	 */
	async load() {
		const { default: mapData } = await import(`./maps/${this.#mapID}.js`)

		this.#mapData = mapData

		console.log(mapData)
	}

	/**
	 * Renders the map to a canvas.
	 *
	 * @param {Renderer} renderer The renderer to be used for drawing the map.
	 */
	render(renderer) {
		renderer.layer = LAYERS.foreground

		this.tiles.forEach((tileData, index) => {
			if (!Array.isArray(tileData)) {
				tileData = [tileData]
			}

			const [
				rendererIndex,
				tileConfig = {},
			] = tileData

			const x = index % this.width
			const y = Math.floor((index - x) / this.height)

			const tileRenderer = TILE_RENDERERS[rendererIndex]

			if (tileRenderer) {
				tileRenderer({
					destinationX: x * TILE_SIZE.width,
					destinationY: y * TILE_SIZE.height,
					renderer,
					tileset: this.#gameManager.tileset,
				}, tileConfig)
			}
		})
	}





	/****************************************************************************\
	 * Public instance getters
	\****************************************************************************/

	/**
	 * @returns {number} The map's height.
	 */
	get height() {
		return this.#mapData.height
	}

	/**
	 * @returns {string} The map's name.
	 */
	get name() {
		return this.#mapData.name
	}

	/**
	 * @returns {object} The starting coordinates.
	 */
	get startingPosition() {
		return this.#mapData.startingPosition
	}

	/**
	 * @returns {Array} An array of tile configs.
	 */
	get tiles() {
		return this.#mapData.tiles
	}

	/**
	 * @returns {number} The map's width.
	 */
	get width() {
		return this.#mapData.width
	}
}
