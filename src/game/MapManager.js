// Module imports
import { aStar } from 'ngraph.path'
import createGraph from 'ngraph.graph'





// Local imports
import { LAYERS } from './Renderer.js'
import { setGlobalOffset } from '../newStore/helpers/setGlobalOffset.js'
import { TILE_SIZE } from './Tile.js'
import { store } from '../newStore/store.js'





export class MapManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#graph = null

	#needsRecenter = true

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
							height: tileTypeData.height,
							isBlocking: tileTypeData.isBlocking,
							isTraversable: tileTypeData.isTraversable,
							renderStack: [tileTypeData.image],
							width: tileTypeData.width,
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
	 * @param {MapManager} [options.parent] The parent of the map (if this is a tileset).
	 * @param {boolean} [options.shouldCenter = true] Whether the map should be centered on first render.
	 */
	constructor(options) {
		const {
			map,
			parent,
			shouldCenter = true,
		} = options

		this.#needsRecenter = shouldCenter
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

		this.#graph.forEachNode(node => {
			const {
				height,
				renderStack,
				width,
				x,
				y,
			} = node.data

			const targetX = x + offset.x
			const targetY = y + offset.y

			renderStack.forEach(image => {
				renderer.drawImage({
					image,
					source: {
						height: image.height,
						width: image.width,
						x: 0,
						y: 0,
					},
					destination: {
						cell: {
							x: targetX,
							y: targetY,
						},
						height,
						width,
					},
				})
			})
		})

		if (this.isTileset) {
			this.#graph.forEachNode(node => {
				const {
					height,
					width,
					x,
					y,
				} = node.data

				const targetX = x + cursorOffset.x
				const targetY = y + cursorOffset.y

				const targetNode = this.#parent.graph.getNode(`${targetX}|${targetY}`)

				if (targetNode?.data.isBlocking || targetNode?.data.isTraversable) {
					renderer.setColor(null, 'red')
					renderer.drawRectangle({
						cell: {
							x: targetX,
							y: targetY,
						},
						height,
						width,
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
