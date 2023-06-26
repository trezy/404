// Module imports
import {
	AlphaFilter,
	ColorMatrixFilter,
	Container,
	Sprite,
} from 'pixi.js'
import createGraph from 'ngraph.graph'





// Local imports
import { store } from '../../newStore/store.js'
import { TILE_SIZE } from '../../game/Tile.js'
import { Vector2 } from './Vector2.js'





// Types

/**
 * @typedef {object} MapConfig
 * @property {number} [alpha = 1] The default alpha falue of the map.
 * @property {import('ngraph.graph').Graph} [graph] A pre-generated graph.
 * @property {object} [mapData] The base map data.
 * @property {import('pixi.js').Container} [sprite] A pre-generated sprite.
 * @property {Vector2[]} [destinations] A pre-generated list of destinations.
 * @property {Vector2} [startingPosition] A pre-generated starting position.
 */





/**
 * Maintains the node graph and sprite for a map.
 */
export class TileMapManager {
	/****************************************************************************\
	 * Static methods
	\****************************************************************************/

	/**
	 * Finds conflicting cells between two maps.
	 *
	 * @param {TileMapManager} mapA The source map.
	 * @param {TileMapManager} mapB The destination map.
	 * @returns {Vector2[]} A list of conflict coordinates (absolute).
	 */
	static findConflicts(mapA, mapB) {
		const conflicts = []

		mapA.graph.forEachNode(node => {
			const { position } = node.data

			const absolutePosition = Vector2.add(position, mapA.offset)

			if (mapA.hasConflictAt(position) && mapB.hasConflictAt(absolutePosition)) {
				conflicts.push(absolutePosition)
			}
		})

		return conflicts
	}

	/**
	 * Determines if there are any conflicts between two maps.
	 *
	 * @param {TileMapManager} mapA The source map.
	 * @param {TileMapManager} mapB The destination map.
	 * @returns {boolean} Whether there are conflicts between the two maps.
	 */
	static haveConflicts(mapA, mapB) {
		return Boolean(TileMapManager.findConflicts(mapA, mapB).length)
	}

	/**
	 * Merges 2 maps together, returning a new map. If both map graphs have a
	 * node at the same coordinate, the node from the map B will overwrite the
	 * node from map A.
	 *
	 * @param {Map} mapA The map to be merged in.
	 * @param {Map} mapB The map to be merged with.
	 * @param {MapConfig} [mapOptions = {}] Additional configuration options to be passed to the new map.
	 * @returns {Map} The new map.
	 */
	static mergeTileMaps(mapA, mapB, mapOptions = {}) {
		const newGraph = createGraph()
		const newSprite = new Container

		mapB.graph.forEachNode(node => {
			const { offset } = mapB
			const position = Vector2.fromString(node.id)
			const tileSprite = mapB.getSpriteAt(position)
			const newPosition = Vector2.add(position, offset)
			const newPositionString = newPosition.toString()

			tileSprite.x = newPosition.x * TILE_SIZE.width
			tileSprite.y = newPosition.y * TILE_SIZE.height
			tileSprite.name = newPositionString

			newSprite.addChild(tileSprite)
			newGraph.addNode(newPositionString, {
				...node.data,
				position: newPosition,
			})

			mapB.sprite.removeChild(tileSprite)
		})

		mapA.graph.forEachNode(node => {
			const position = Vector2.fromString(node.id)
			const tileSprite = mapA.getSpriteAt(position)

			if (!tileSprite) {
				return
			}

			const { offset } = mapA
			const newPosition = Vector2.add(position, offset)
			const newPositionString = newPosition.toString()

			if (newGraph.getNode(newPositionString)) {
				tileSprite.destroy({ children: true })
				return
			}

			newSprite.addChild(tileSprite)
			newGraph.addNode(newPositionString, {
				...node.data,
				position: newPosition,
			})
			mapA.sprite.removeChild(tileSprite)
		})

		TileMapManager.updateGraphLinks(newGraph)

		if (!mapOptions.mapData) {
			mapOptions.startingPosition = mapA.startingPosition ?? mapB.startingPosition
			mapOptions.destinations = [
				...mapA.destinations || [],
				...mapB.destinations || [],
			]
		}

		return new TileMapManager({
			graph: newGraph,
			sprite: newSprite,
			...mapOptions,
		})
	}

	/**
	 * Updates links between nodes in the graph.
	 */
	static updateGraphLinks(graph) {
		graph.forEachNode(node => {
			const {
				isBlocking,
				isTraversable,
				position,
			} = node.data

			const {
				x,
				y,
			} = position

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
					const adjacentNode = graph.getNode(adjacentNodeID)

					if (adjacentNode?.data.isTraversable) {
						graph.addLink(node.id, adjacentNodeID)
					}
				})
			} else if (isBlocking) {
				graph.forEachLinkedNode(node.id, (_, link) =>{
					graph.removeLink(link)
				})
			}
		})
	}





	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {number} */
	#alpha

	/** @type {null | Vector2[]} */
	#destinations = null

	/** @type {import('ngraph.graph').Graph} */
	#graph

	/** @type {object} */
	#mapData

	/** @type {Vector2} */
	#offset = new Vector2(0, 0)

	/** @type {import('pixi.js').Sprite} */
	#sprite

	/** @type {null | Vector2} */
	#startingPosition = null

	/** @type {{ [string]: Container }} */
	#tileSprites = {}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new map.
	 *
	 * @param {MapConfig} [config = {}] Map configuration options.
	 */
	constructor(config = {}) {
		this.#mapData = config.mapData

		if (config.startingPosition) {
			this.#startingPosition = config.startingPosition
		} else if (this.#mapData?.startingPosition) {
			this.#startingPosition = new Vector2(this.#mapData.startingPosition.x, this.#mapData.startingPosition.y)
		}

		if (config.destinations) {
			this.#destinations = config.destinations
		} else if (this.#mapData?.destinations) {
			this.#destinations = this.#mapData.destinations.map(destination => {
				return new Vector2(destination.x, destination.y)
			})
		}

		this.#alpha = config.alpha ?? 1
		this.#graph = config.graph
		this.#sprite = config.sprite

		if (!this.#graph) {
			this.#generateGraph()
		}

		if (!this.#sprite) {
			this.#generateSprite()
		}

		this.#updateTileSprites()
		this.#resetTileAlpha()
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Generates a node graph for the map.
	 */
	#generateGraph() {
		const { contentManager } = store.state

		this.#graph = createGraph()

		this.#mapData.tiles.forEach((layer, layerIndex) => {
			Object
				.entries(layer)
				.forEach(([coordinateString, tileData]) => {
					const position = Vector2.fromString(coordinateString)
					const tileTypeData = contentManager.getTile(tileData.tileID, tileData.resourcepackID)

					delete tileData.x
					delete tileData.y

					if (this.#graph.hasNode(coordinateString)) {
						const node = this.#graph.getNode(coordinateString)

						node.data.tileStack[layerIndex] = {
							...tileData,
							position,
						}

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
							position,
							tileStack: [],
							width: tileTypeData.width,
						}

						nodeData.tileStack[layerIndex] = { ...tileData }

						this.#graph.addNode(coordinateString, nodeData)
					}
				})
		})

		TileMapManager.updateGraphLinks(this.#graph)
	}

	/**
	 * Generates a sprite for the map.
	 */
	#generateSprite() {
		const { contentManager } = store.state
		const mapContainer = new Container

		this.#graph.forEachNode(node => {
			const coordinateString = node.id
			const position = Vector2.fromString(coordinateString)

			/** @type {Container} */
			const targetContainer = new Container
			this.#tileSprites[coordinateString] = targetContainer
			mapContainer.addChild(targetContainer)

			targetContainer.x = position.x * TILE_SIZE.width
			targetContainer.y = position.y * TILE_SIZE.height
			targetContainer.name = coordinateString
			targetContainer.filters = [
				new AlphaFilter(this.#alpha),
				new ColorMatrixFilter,
			]

			if (node.data.tileStack) {
				node.data.tileStack.forEach((tileData, layerIndex) => {
					const resourcepack = contentManager.getResourcepack(tileData.resourcepackID)
					const sprite = new Sprite(resourcepack.tilesSpritesheet.textures[tileData.tileID])

					targetContainer.addChildAt(sprite, layerIndex)
				})
			}
		})

		this.#sprite = mapContainer
	}

	/**
	 * Determines if there's a conflict at the requested coordinated.
	 *
	 * @param {Vector2} position The position to check for a conflict.
	 * @returns {boolean} Whether there's a conflict at the requested position.
	 */
	hasConflictAt(position) {
		const targetNode = this.getNodeAt(position)

		return targetNode?.data.isBlocking || targetNode?.data.isTraversable
	}

	/**
	 * Resets all tiles to the map's primary alpha value.
	 */
	#resetTileAlpha() {
		this.setTileAlpha(this.#alpha)
	}

	/**
	 * Regenerates the tile sprites cache.
	 */
	#updateTileSprites() {
		this.sprite.children.forEach(childSprite => {
			this.#tileSprites[childSprite.name] = childSprite
		})
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Retrieves a node from a specific coordinate relative to the map.
	 *
	 * @param {Vector2} position The position of the node to be retrieved.
	 * @returns {import('ngraph.graph').node | undefined} The requested node.
	 */
	getNodeAt(position) {
		return this.#graph.getNode(position.toString())
	}

	/**
	 * Retrieves a sprite from a specific coordinate relative to the map.
	 *
	 * @param {Vector2} position The position of the sprite to be retrieved.
	 * @returns {Container | undefined} The tile container.
	 */
	getSpriteAt(position) {
		return this.#tileSprites[position.toString()]
	}

	/**
	 * Displays a tile as invalid.
	 *
	 * @param {Vector2} position The position of the sprite to be marked.
	 */
	markTileInvalid(position) {
		const sprite = this.getSpriteAt(position)

		/** @type {AlphaFilter} */
		const alphaFilter = sprite.filters.find(filter => filter instanceof AlphaFilter)

		/** @type {ColorMatrixFilter} */
		const colorMatrixFilter = sprite.filters.find(filter => filter instanceof ColorMatrixFilter)

		colorMatrixFilter.tint(0xff0000, true)
		alphaFilter.alpha = 1
	}

	/**
	 * Displays a tile as invalid.
	 *
	 * @param {Vector2} position The position of the sprite to be marked.
	 */
	markTileValid(position) {
		const sprite = this.getSpriteAt(position)

		/** @type {AlphaFilter} */
		const alphaFilter = sprite.filters.find(filter => filter instanceof AlphaFilter)

		/** @type {ColorMatrixFilter} */
		const colorMatrixFilter = sprite.filters.find(filter => filter instanceof ColorMatrixFilter)

		alphaFilter.alpha = 0.5
		colorMatrixFilter.reset()
	}

	/**
	 * Sets the alpha value for one or all tiles in the map.
	 *
	 * @param {number} alpha The new alpha value.
	 * @param {Vector2} [position] The position of the sprite whose alpha will be set.
	 */
	setTileAlpha(alpha, position) {
		if (position) {
			const sprite = this.#tileSprites[position.toString()]
			const alphaFilter = sprite.filters.find(filter => filter instanceof AlphaFilter)

			alphaFilter.alpha = alpha
		} else {
			Object.keys(this.#tileSprites).forEach(coordinateString => {
				position = Vector2.fromString(coordinateString)
				this.setTileAlpha(alpha, position)
			})
		}
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/** @returns {number} */
	get alpha() {
		return this.#alpha
	}

	/**
	 * Sets the map's primary alpha. Does not affect tiles whose alpha is
	 * different than the current primary alpha.
	 *
	 * @param {number} alpha The new alpha.
	 */
	set alpha(newAlpha) {
		this.#alpha = newAlpha
	}

	/** @returns {Vector2[]} */
	get destinations() {
		return this.#destinations
	}

	/** @returns {import('ngraph.graph').Graph} */
	get graph() {
		return this.#graph
	}

	/** @returns {Vector2} */
	get offset() {
		return this.#offset
	}

	/**
	 * Sets the map's offset.
	 *
	 * @param {Vector2} offset The new offset.
	 */
	set offset(newOffset) {
		this.#offset = newOffset
	}

	/** @returns {Container} */
	get sprite() {
		return this.#sprite
	}

	/** @returns {Vector2} */
	get startingPosition() {
		return this.#startingPosition
	}
}
