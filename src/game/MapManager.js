// Module imports
import PF from 'pathfinding'





// Local imports
import { ContentManager } from './ContentManager.js'
import { LAYERS } from './Renderer.js'
import { setGlobalOffset } from '../newStore/helpers/setGlobalOffset.js'
import { TILE_SIZE } from './Tile.js'
import { store } from '../newStore/store.js'





export class MapManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#gameManager = null

	#needsRecenter = true

	#map = null

	#pathfindingGrid = null





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new map.
	 *
	 * @param {object} options All options.
	 * @param {import('./GameManager.js').GameManager} options.gameManager The `GameManager` this map belongs to.
	 * @param {string} options.map The map.
	 */
	constructor(options) {
		const {
			gameManager,
			map,
		} = options

		this.#gameManager = gameManager
		this.#map = map
		map.layerGrids = []

		this.#pathfindingGrid = new PF.Grid(this.width, this.height)

		map.tiles.forEach(layerData => {
			const layerGrid = this.generateGrid()

			Object
			.entries(layerData)
			.forEach(([coordinateString, tileData]) => {
				const [x, y] = coordinateString.split('|').map(Number)

				layerGrid[y][x] = this
					.contentManager
					.getTile(tileData.tileID, tileData.resourcepackID)
			})

			map.layerGrids.push(layerGrid)
		})

		let y = 0

		while (y < this.height) {
			let x = 0

			while (x < this.width) {
				const coordinateString = `${x}|${y}`
				const cell = map.pfgrid[coordinateString]

				if (cell) {
					this.#pathfindingGrid.setWalkableAt(x, y, cell.isTraversable)
				} else {
					this.#pathfindingGrid.setWalkableAt(x, y, false)
				}

				x += 1
			}

			y += 1
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	generateGrid() {
		return Array(this.height)
			.fill(null)
			.map(() => {
				return Array(this.width).fill(null)
			})
	}

	render(renderer) {
		if ((renderer.width === 0) || (renderer.height === 0)) {
			return
		}

		if (this.#needsRecenter) {
			setGlobalOffset(
				((renderer.width * renderer.resolution) - (this.pixelWidth * renderer.pixelSize)) / 2,
				((renderer.height * renderer.resolution) - (this.pixelHeight * renderer.pixelSize)) / 2,
			)

			this.#needsRecenter = false
		}

		renderer.layer = LAYERS.foreground

		this.layerGrids.forEach(layerGrid => {
			layerGrid.forEach((row, y) => {
				row.forEach((tileData, x) => {
					if (tileData === null) {
						return
					}

					renderer.drawImage({
						image: tileData.image,
						source: {
							height: tileData.image.height,
							width: tileData.image.width,
							x: 0,
							y: 0,
						},
						destination: {
							height: TILE_SIZE.height,
							width: TILE_SIZE.width,
							x: x * TILE_SIZE.width,
							y: y * TILE_SIZE.height,
						},
					})
				})
			})
		})
	}





	/****************************************************************************\
	 * Public instance getters
	\****************************************************************************/

	/**
	 * @returns {ContentManager} The game's `ContentManager`.
	 */
	get contentManager() {
		return this.#gameManager.contentManager
	}

	/**
	 * @returns {Array} An array of possible destinations.
	 */
	get destinations() {
		return this.#map.destinations
	}

	/**
	 * @returns {number} The map's height.
	 */
	get height() {
		return this.#map.dimensions.height
	}

	/**
	 * @returns {Array} An array of layer grids.
	 */
	get layerGrids() {
		return this.#map.layerGrids
	}

	/**
	 * @returns {Array} An array of map layers.
	 */
	get layers() {
		return this.#map.tiles
	}

	/**
	 * @returns {string} The map's name.
	 */
	get name() {
		return this.#map.name
	}

	/**
	 * @returns {PF.Grid} The pathfinding grid.
	 */
	get pathfindingGrid() {
		return this.#pathfindingGrid
	}

	/**
	 * @returns {number} The map's height in pixels.
	 */
	get pixelHeight() {
		return this.#map.dimensions.height * TILE_SIZE.height
	}

	/**
	 * @returns {number} The map's width in pixels.
	 */
	get pixelWidth() {
		return this.#map.dimensions.width * TILE_SIZE.width
	}

	/**
	 * @returns {object} The starting coordinates.
	 */
	get startingPosition() {
		return this.#map.startingPosition
	}

	/**
	 * @returns {number} The map's width.
	 */
	get width() {
		return this.#map.dimensions.width
	}
}
