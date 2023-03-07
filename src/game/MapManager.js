// Module imports
import createGraph from 'ngraph.graph'
import PF from 'pathfinding'





// Local imports
import { LAYERS } from './Renderer.js'
import { setGlobalOffset } from '../newStore/helpers/setGlobalOffset.js'
import { TILE_SIZE } from './Tile.js'
import { store } from '../newStore/store.js'





// Constants
const MAP_PADDING = 40





export class MapManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#finder = new PF.AStarFinder({
		diagonalMovement: PF.DiagonalMovement.Never,
	})

	#graph = null

	#layerGrids = []

	#needsRecenter = true

	#map = null

	#parent = null

	#pathfindingGrid = null

	#tileset = null

	#nextTilesetIndex = 0





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	#generateGraph() {
		const { contentManager } = store.state

		this.#graph = createGraph()

		this.#map.tiles.forEach(layer => {
			Object
				.entries(layer)
				.forEach(([coordinateString, tileData]) => {
					const [x, y] = coordinateString.split('|').map(Number).map(Number)

					const tileTypeData = contentManager.getTile(tileData.tileID, tileData.resourcepackID)

					if (this.#graph.hasNode(coordinateString)) {
						const node = this.#graph.getNode(coordinateString)

						if (tileTypeData.isBlocking) {
							node.data.isBlocking = true
							node.data.isTraversable = false
						} else if (tileTypeData.isTraversable && !node.data.isBlocking) {
							node.data.isTraversable = tileTypeData.isTraversable
						}
					} else {
						this.#graph.addNode(coordinateString, {
							isBlocking: tileTypeData.isBlocking,
							isTraversable: tileTypeData.isTraversable,
							renderStack: [tileTypeData.image],
							x,
							y,
						})
					}
				})
		})

		this.#updateGraphLinks()
	}

	#nextTileset() {
		const nextTileset = this.#map.queue?.[this.#nextTilesetIndex]

		if (nextTileset) {
			const { gameManager } = store.state

			this.#tileset = new MapManager({
				gameManager,
				map: this.#map.queue[this.#nextTilesetIndex],
				parent: this,
				shouldCenter: false,
			})

			this.#nextTilesetIndex += 1
		} else {
			this.#tileset = null
		}
	}

	#updateGraphLinks() {
		this.#graph.forEachNode(node => {
			const {
				isBlocking,
				isTraversable,
				x,
				y,
			} = node.data

			if (isTraversable) {
				const adjacentNodeIDs = [
					// east
					`${x + 1}|${y}`,

					// west
					`${x - 1}|${y}`,

					// south
					`${x}|${y + 1}`,

					// north
					`${x}|${y - 1}`,
				]

				adjacentNodeIDs.forEach(adjacentNodeID => {
					const adjacentNode = this.#graph.getNode(adjacentNodeID)

					if (adjacentNode?.data.isTraversable) {
						this.#graph.addLink(node.id, adjacentNodeID)
					}
				})
			} else if (isBlocking) {
				this.#graph.forEachLinkedNode(node.id, (linkedNode, link) =>{
					this.#graph.removeLink(link)
				})
			}
		})
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new map.
	 *
	 * @param {object} options All options.
	 * @param {string} options.map The map.
	 * @param {MapManager} options.parent The parent of the map (if this is a tileset).
	 * @param {boolean} options.shouldCenter Whether the map should be centered on first render.
	 */
	constructor(options) {
		const {
			map,
			parent,
			shouldCenter = true,
		} = options

		const { contentManager } = store.state

		this.#needsRecenter = shouldCenter
		this.#map = map
		this.#parent = parent
		this.#pathfindingGrid = this.generatePFGrid()

		this.#generateGraph()

		map.tiles.forEach(layerData => {
			const layerGrid = this.generateGrid()

			Object
				.entries(layerData)
				.forEach(([coordinateString, tileData]) => {
					const [x, y] = coordinateString.split('|').map(Number).map(Number)

					layerGrid[y][x] = contentManager.getTile(tileData.tileID, tileData.resourcepackID)
				})

			this.#layerGrids.push(layerGrid)
		})

		let y = 0

		while (y < this.height) {
			let x = 0

			while (x < this.width) {
				const coordinateString = `${x}|${y}`
				const cell = map.pfgrid[coordinateString]

				if (cell?.isTraversable) {
					this.makeCellTraversable(x, y)
				} else {
					this.makeCellUntraversable(x, y)
				}

				x += 1
			}

			y += 1
		}

		if (!this.isTileset) {
			this.#nextTileset()
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	findPath(fromX, fromY, toX, toY) {
		const [
			fromPFX,
			fromPFY,
		] = this.getPFCellCoordinates(fromX, fromY)
		const [
			toPFX,
			toPFY,
		] = this.getPFCellCoordinates(toX, toY)

		const grid = this.#pathfindingGrid.clone()

		const path = this.#finder.findPath(
			fromPFX,
			fromPFY,
			toPFX,
			toPFY,
			grid,
		)

		return path.map(([x, y]) => this.getCellFromPFCoordinates(x, y))
	}

	generateGrid() {
		return Array(this.height)
			.fill(null)
			.map(() => {
				return Array(this.width).fill(null)
			})
	}

	generatePFGrid() {
		if (this.isTileset) {
			return new PF.Grid(this.width, this.height)
		}

		const pfGridHeight = this.height + MAP_PADDING
		const pfGridWidth = this.width + MAP_PADDING

		const pfGrid = new PF.Grid(pfGridWidth, pfGridHeight)

		let xIndex = 0

		while (xIndex < pfGridWidth) {
			let yIndex = 0

			while (yIndex < pfGridHeight) {
				pfGrid.setWalkableAt(xIndex, yIndex, false)

				yIndex += 1
			}

			xIndex += 1
		}

		return pfGrid
	}

	getCellFromPFCoordinates(x, y) {
		return [
			x - Math.ceil(MAP_PADDING / 2),
			y - Math.ceil(MAP_PADDING / 2),
		]
	}

	getOccupiedCoordinates() {
		return this.#layerGrids.reduce((accumulator, layerGrid) => {
			layerGrid.forEach((row, y) => {
				row.forEach((tileData, x) => {
					if (tileData) {
						accumulator[`${x}|${y}`] = true
					}
				})
			})

			return accumulator
		}, {})
	}

	getPFCellCoordinates(x, y) {
		if (this.isTileset) {
			return [x, y]
		}

		return [
			x + Math.ceil(MAP_PADDING / 2),
			y + Math.ceil(MAP_PADDING / 2),
		]
	}

	makeCellTraversable(x, y) {
		const [
			cellX,
			cellY,
		] = this.getPFCellCoordinates(x, y)
		this.#pathfindingGrid.setWalkableAt(cellX, cellY, true)
	}

	makeCellUntraversable(x, y) {
		const [
			cellX,
			cellY,
		] = this.getPFCellCoordinates(x, y)
		this.#pathfindingGrid.setWalkableAt(cellX, cellY, false)
	}

	placeTileset() {
		const { cursorOffset } = store.state

		const layerCount = Math.max(this.#layerGrids.length, this.#tileset.layerGrids.length)

		const occupiedCoordinates = this.#tileset.getOccupiedCoordinates()

		let canPlace = true

		this.#tileset.graph.forEachNode(node => {
			if (!canPlace) {
				return
			}

			const {
				x,
				y,
			} = node.data

			const targetX = x + cursorOffset.x
			const targetY = y + cursorOffset.y

			const targetNode = this.#graph.getNode(`${targetX}|${targetY}`)

			if (targetNode?.data.isBlocking || targetNode?.data.isTraversable) {
				canPlace = false
			}
		})

		if (!canPlace) {
			return
		}

		this.#tileset.graph.forEachNode(node => {
			const {
				x,
				y,
			} = node.data

			const targetX = x + cursorOffset.x
			const targetY = y + cursorOffset.y

			this.#graph.addNode(`${targetX}|${targetY}`, {
				...node.data,
				x: targetX,
				y: targetY,
			})
		})

		this.#updateGraphLinks()

		let layerIndex = 0
		while (layerIndex < layerCount) {
			let targetLayerGrid = this.#layerGrids[layerIndex]

			if (!targetLayerGrid) {
				targetLayerGrid = this.generateGrid()
				this.#layerGrids.push(targetLayerGrid)
			}

			const sourceLayerGrid = this.#tileset.layerGrids[layerIndex]

			if (sourceLayerGrid) {
				Object.keys(occupiedCoordinates).forEach(coordinateString => {
					const [x, y] = coordinateString.split('|').map(Number)

					const targetY = y + cursorOffset.y
					const targetX = x + cursorOffset.x

					const tileData = sourceLayerGrid[y][x]

					if (tileData) {
						targetLayerGrid[targetY][targetX] = tileData
					}
				})
			} else {
				Object.keys(occupiedCoordinates).forEach(coordinateString => {
					const [x, y] = coordinateString.split('|').map(Number)

					const targetX = x + cursorOffset.x
					const targetY = y + cursorOffset.y

					targetLayerGrid[targetY][targetX] = null
				})
			}

			layerIndex += 1
		}

		Object.keys(occupiedCoordinates).forEach(coordinateString => {
			const [x, y] = coordinateString.split('|').map(Number)

			const targetX = x + cursorOffset.x
			const targetY = y + cursorOffset.y

			const [
				targetPFCellX,
				targetPFCellY,
			] = this.getPFCellCoordinates(targetX, targetY)

			const node = this.#tileset.pathfindingGrid.nodes[y][x]

			this.#pathfindingGrid.setWalkableAt(targetPFCellX, targetPFCellY, node.walkable)
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

		if (this.isTileset) {
			offset.x += cursorOffset.x
			offset.y += cursorOffset.y
		}

		renderer.layer = LAYERS.foreground

		const occupiedCoordinates = this.getOccupiedCoordinates()

		this.#layerGrids.forEach(layerGrid => {
			Object.keys(occupiedCoordinates).forEach(coordinateString => {
				const [x, y] = coordinateString.split('|').map(Number)

				const tileData = layerGrid[y]?.[x]

				if (!tileData) {
					return
				}

				const targetX = x + offset.x
				const targetY = y + offset.y

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
							x: targetX,
							y: targetY,
						},
						height: TILE_SIZE.height,
						width: TILE_SIZE.width,
					},
				})
			})
		})

		if (this.isTileset) {
			Object.keys(occupiedCoordinates).forEach(coordinateString => {
				const [x, y] = coordinateString.split('|').map(Number)

				const targetX = x + cursorOffset.x
				const targetY = y + cursorOffset.y

				const canPlace = this.#parent.layerGrids.every(layerGrid => {
					const cellData = layerGrid[targetY]?.[targetX]
					return !(cellData?.isBlocking || cellData?.isTraversable)
				})

				if (!canPlace) {
					renderer.setColor(null, 'red')
					renderer.drawRectangle({
						cell: {
							x: targetX,
							y: targetY,
						},
						height: TILE_SIZE.height,
						width: TILE_SIZE.width,
					})
				}
			})
		}

		if (!this.isTileset && this.#tileset) {
			renderer.setAlpha(0.6)
			this.#tileset.render(renderer)
			renderer.setAlpha(1)
		}
	}





	/****************************************************************************\
	 * Public instance getters
	\****************************************************************************/

	/**
	 * @returns {Array} An array of possible destinations.
	 */
	get destinations() {
		return this.#map.destinations
	}

	/**
	 * @returns {PF.AStarFinder} The map's pathfinder.
	 */
	get finder() {
		return this.#finder
	}

	/**
	 * @returns {import('ngraph.graph').Graph} The map's graph.
	 */
	get graph() {
		return this.#graph
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
		return Boolean(this.#parent)
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
