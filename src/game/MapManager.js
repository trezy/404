// Module imports
import PF from 'pathfinding'





// Local imports
import {
	LAYERS,
	Renderer,
} from './Renderer.js'
import { Tile } from './Tile.js'





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

	#pathfindingGrid = null

	#tiles = []





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new map.
	 *
	 * @param {object} options All options.
	 * @param {import('./GameManager.js').GameManager} options.gameManager The `GameManager` this map belongs to.
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

		this.#pathfindingGrid = new PF.Grid(mapData.width, mapData.height)

		const tileCount = mapData.width * mapData.height
		let tileIndex = 0

		while (tileIndex < tileCount) {
			const tileConfig = {
				layers: [],
				mapManager: this,
				position: {
					x: tileIndex % mapData.width,
					y: Math.floor((tileIndex - (tileIndex % mapData.width)) / mapData.height),
				},
			}

			this.#mapData.tiles.forEach(layer => {
				let tileData = layer[tileIndex]

				if (tileData === null) {
					tileData = { type: 'empty' }
				}

				tileConfig.layers.push(tileData)
			})

			const tile = new Tile(tileConfig)

			this.#tiles.push(tile)
			this.#pathfindingGrid.setWalkableAt(tile.position.x, tile.position.y, tile.isTraversable)

			tileIndex += 1
		}
	}

	/**
	 * Renders the map to a canvas.
	 *
	 * @param {Renderer} renderer The renderer to be used for drawing the map.
	 */
	render(renderer) {
		renderer.layer = LAYERS.foreground

		this.#tiles.forEach(tile => {
			tile.render(renderer, this.#gameManager.tileset)
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
	 * @returns {PF.Grid} The pathfinding grid.
	 */
	get pathfindingGrid() {
		return this.#pathfindingGrid
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
		return this.#tiles
	}

	/**
	 * @returns {number} The map's width.
	 */
	get width() {
		return this.#mapData.width
	}
}
