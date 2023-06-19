// Module imports
import { aStar } from 'ngraph.path'
import createGraph from 'ngraph.graph'





// Local imports
import { TILE_SIZE } from './Tile.js'
import { store } from '../newStore/store.js'





export class MapManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#graph = null

	#map = null

	#parent = null

	#tileset = null

	#nextTilesetIndex = 0





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	#generateGraph() {
		const { contentManager } = store.state

		this.#graph = createGraph()

		this.#map.tiles.forEach((layer, layerIndex) => {
			Object
				.entries(layer)
				.forEach(([coordinateString, tileData]) => {
					const [x, y] = coordinateString.split('|').map(Number)

					const tileTypeData = contentManager.getTile(tileData.tileID, tileData.resourcepackID)

					if (this.#graph.hasNode(coordinateString)) {
						const node = this.#graph.getNode(coordinateString)

						node.data.tileStack[layerIndex] = { ...tileData }

						if (tileTypeData.isBlocking) {
							node.data.isBlocking = true
							node.data.isTraversable = false
						} else if (tileTypeData.isTraversable && !node.data.isBlocking) {
							node.data.isTraversable = tileTypeData.isTraversable
						}
					} else {
						const nodeData = {
							height: tileTypeData.height,
							isBlocking: tileTypeData.isBlocking,
							isTraversable: tileTypeData.isTraversable,
							renderStack: [],
							tileStack: [],
							width: tileTypeData.width,
							x,
							y,
						}

						nodeData.tileStack[layerIndex] = { ...tileData }

						this.#graph.addNode(coordinateString, nodeData)
					}
				})
		})

		this.#updateGraphLinks()
	}

	#nextTileset() {
		const nextTileset = this.#map.queue?.[this.#nextTilesetIndex]

		if (nextTileset) {
			this.#tileset = new MapManager({
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
	 * @param {MapManager} [options.parent] The parent of the map (if this is a tileset).
	 */
	constructor(options) {
		const {
			map,
			parent,
		} = options

		this.#map = map
		this.#parent = parent

		this.#generateGraph()

		if (!this.isTileset) {
			this.#nextTileset()
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	findPath(fromX, fromY, toX, toY) {
		if (this.#graph.hasNode(`${toX}|${toY}`)) {
			return aStar(this.#graph).find(
				`${fromX}|${fromY}`,
				`${toX}|${toY}`,
			)
		}

		return null
	}

	placeTileset() {
		const { cursorOffset } = store.state

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
		this.#nextTileset()
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
