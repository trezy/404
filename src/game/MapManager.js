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

	#isTileset = false

	#layerGrids = []

	#needsRecenter = true

	#map = null

	#pathfindingGrid = null

	#tileset = null

	#nextTilesetIndex = 0





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	#nextTileset() {
		const nextTileset = this.#map.queue?.[this.#nextTilesetIndex]

		if (nextTileset) {
			this.#tileset = new MapManager({
				gameManager: this.#gameManager,
				isTileset: true,
				map: this.#map.queue[this.#nextTilesetIndex],
				shouldCenter: false,
			})

			this.#nextTilesetIndex += 1
		} else {
			this.#tileset = null
		}
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new map.
	 *
	 * @param {object} options All options.
	 * @param {boolean} isTileset Whether this map is a tileset.
	 * @param {import('./GameManager.js').GameManager} options.gameManager The `GameManager` this map belongs to.
	 * @param {string} options.map The map.
	 */
	constructor(options) {
		const {
			gameManager,
			isTileset,
			map,
			shouldCenter = true,
		} = options

		this.#isTileset = isTileset
		this.#needsRecenter = shouldCenter

		this.#gameManager = gameManager
		this.#map = map
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

			this.#layerGrids.push(layerGrid)
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

		if (!this.#isTileset) {
			this.#nextTileset()
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

	placeTileset() {
		const { cursorOffset } = store.state

		const layerCount = Math.max(this.#layerGrids.length, this.#tileset.layerGrids.length)

		const occupiedCoordinates = {}

		let layerIndex = 0
		while (layerIndex < layerCount) {
			let targetLayerGrid = this.#layerGrids[layerIndex]

			if (!targetLayerGrid) {
				targetLayerGrid = this.generateGrid()
				this.#layerGrids.push(targetLayerGrid)
			}

			const sourceLayerGrid = this.#tileset.layerGrids[layerIndex]

			if (sourceLayerGrid) {
				sourceLayerGrid.forEach((row, y) => {
					row.forEach((tileData, x) => {
						const targetX = x + cursorOffset.x
						const targetY = y + cursorOffset.y

						if (tileData) {
							targetLayerGrid[targetY][targetX] = tileData
							occupiedCoordinates[`${targetX}|${targetY}`] = true
						}
					})
				})
			} else {
				Object.keys(occupiedCoordinates).forEach(coordinateString => {
					const [x, y] = coordinateString.split('|')

					targetLayerGrid[y][x] = null
				})
			}

			layerIndex += 1
		}

		this.#tileset.#pathfindingGrid.nodes.forEach((row, y) => {
			row.forEach((node, x) => {
				const targetX = x + cursorOffset.x
				const targetY = y + cursorOffset.y

				this.#pathfindingGrid.setWalkableAt(targetX, targetY, node.walkable)
			})
		})

		this.#nextTileset()
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

		const { cursorOffset } = store.state

		const offset = {
			x: 0,
			y: 0,
		}

		if (this.#isTileset) {
			offset.x += cursorOffset.x
			offset.y += cursorOffset.y
		}

		renderer.layer = LAYERS.foreground

		this.#layerGrids.forEach(layerGrid => {
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
							cell: {
								x: x + offset.x,
								y: y + offset.y,
							},
							height: TILE_SIZE.height,
							width: TILE_SIZE.width,
						},
					})
				})
			})
		})

		if (!this.#isTileset && this.#tileset) {
			renderer.setAlpha(0.6)
			this.#tileset.render(renderer)
			renderer.setAlpha(1)
		}
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
	 * @returns {boolean} Whether this map is a tileset.
	 */
	get isTileset() {
		return this.#isTileset
	}

	/**
	 * @returns {Array} An array of layer grids.
	 */
	get layerGrids() {
		return this.#layerGrids
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
	 * @returns {object} The current tileset.
	 */
	get tileset() {
		return this.#tileset
	}

	/**
	 * @returns {number} The map's width.
	 */
	get width() {
		return this.#map.dimensions.width
	}
}
