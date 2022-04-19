// Local imports
import { MapManager } from './MapManager.js'
import { Renderer } from './Renderer.js'
import { renderStandardSizeTile } from '../helpers/renderStandardSizeTile.js'
import { TileSprite } from './TileSprite.js'





/**
 * @typedef {object} Vector2
 * @property {number} x Coordinates on the horizontal axis.
 * @property {number} y Coordinates on the vertical axis.
 */
/**
 * @typedef {object} TileConfig
 * @property {object[]} [layers] The sprite stack for this tile.
 * @property {MapManager} mapManager The `MapManager` managing this tile.
 * @property {Vector2} position The position at which to render the tile.
 */





// Constants
export const TILE_SIZE = {
	height: 16,
	width: 16,
}

export const TILE_RENDERERS = {
	/**
	 * Renders an empty tile.
	 */
	empty() {},

	/**
	 * Renders a floor tile.
	 *
	 * @param {object} config Configuration for rendering.
	 * @param {number} config.destinationY The Y position at which to render the tile.
	 * @param {MapManager} config.mapManager The `MapManager` managing this tile.
	 * @param {Renderer} config.renderer The Renderer to use to draw this tile.
	 * @param {object} config.sprite The sprite config.
	 * @param {Tile} config.tile The tile to be rendered.
	 */
	floor(config) {
		const {
			destinationY,
			mapManager,
			renderer,
			sprite,
			tile,
		} = config
		const { position } = tile
		const baseX = 48
		const baseY = 176

		let xMod = 0
		let yMod = 0

		switch (sprite.color) {
			case 'dark grey':
				xMod += 2
				break

			case 'green':
				xMod += 3
				break

			case 'hazard':
				xMod += 5
				break

			case 'grey':
				xMod += 1
				break

			case 'orange':
				xMod += 8
				break

			case 'red':
				xMod += 6
				break

			// blue
			default:
				xMod = 0
		}

		if (position.y === 0) {
			yMod = 4
		} else if (position.y === (mapManager.height - 1)) {
			yMod = 2
		} else if (position.x === 0) {
			yMod = 1
		} else if (position.x === (mapManager.width - 1)) {
			yMod = 3
		}

		// @ts-ignore
		renderStandardSizeTile({
			...config,
			sourceX: baseX + (xMod * TILE_SIZE.width * 2),
			sourceY: baseY + (yMod * TILE_SIZE.height * 2),
		})

		if (yMod === 0) {
			renderer.setAlpha(0.5)
			// @ts-ignore
			renderStandardSizeTile({
				...config,
				destinationY: destinationY + TILE_SIZE.height,
				sourceX: 16,
				sourceY: 176,
			})
			renderer.setAlpha(1)
		}
	},

	/**
	 * Renders a wall tile.
	 *
	 * @param {object} config Configuration for rendering.
	 * @param {number} config.destinationY The Y position at which to render the tile.
	 * @param {MapManager} config.mapManager The `MapManager` managing this tile.
	 * @param {Renderer} config.renderer The Renderer to use to draw this tile.
	 * @param {Tile} config.tile The tile to be rendered.
	 */
	wall(config) {
		const {
			destinationY,
			mapManager,
			renderer,
			tile,
		} = config
		const { position } = tile

		let sourceX = 144
		let sourceY = 48

		const hasWallAbove = mapManager
			.tiles[(mapManager.width * (position.y - 1)) + position.x]
			.layers
			.some(sprite => (sprite.type === 'wall'))
		const hasWallBelow = mapManager
			.tiles[(mapManager.width * (position.y + 1)) + position.x]
			.layers
			.some(sprite => (sprite.type === 'wall'))

		if (hasWallAbove && hasWallBelow) {
			sourceX = 112
			sourceY = 16
		} else if (hasWallAbove) {
			sourceX = 112
		} else if (hasWallBelow) {
			sourceY = 16
		}

		// @ts-ignore
		renderStandardSizeTile({
			...config,
			sourceX,
			sourceY,
		})

		renderer.setAlpha(0.5)
		// @ts-ignore
		renderStandardSizeTile({
			...config,
			destinationY: destinationY + TILE_SIZE.height,
			sourceX: 16,
			sourceY: 176,
		})
		renderer.setAlpha(1)
	},
}





/**
 * Constructs a tile config that can be compiled and used in map files.
 */
export class Tile {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#layers = null

	#mapManager = null

	#position = {
		x: 0,
		y: 0,
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Tile.
	 *
	 * @param {TileConfig} config Initial configuration for this tile.
	 */
	constructor(config) {
		if (!this.#validateConfig(config)) {
			throw new Error('Attempted to create new `Tile` with invalid configuration.')
		}

		this.#mapManager = config.mapManager
		this.#position = config.position

		this.#layers = config.layers.map(spriteConfig => {
			return new TileSprite(spriteConfig)
		})
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Validates a configuration object.
	 *
	 * @param {TileConfig} config The configuration object to be validated.
	 * @returns {boolean} Whether or not the configuration object is valid.
	 */
	#validateConfig(config) {
		if (typeof config !== 'object') {
			return false
		}

		if (!config.mapManager) {
			return false
		}

		if (!config.layers) {
			return false
		}

		return true
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Renders this tile to a canvas.
	 *
	 * @param {Renderer} renderer The renderer to use for drawing this tile.
	 * @param {HTMLImageElement} tileset The tileset to draw this tile from.
	 */
	render(renderer, tileset) {
		this.#layers.forEach(sprite => {
			const spriteRenderer = TILE_RENDERERS[sprite.type]

			if (!spriteRenderer) {
				console.log(`Encountered unrecognised tile type: ${sprite.type}`)
				return
			}

			spriteRenderer({
				destinationX: this.#position.x * TILE_SIZE.width,
				destinationY: this.#position.y * TILE_SIZE.height,
				mapManager: this.#mapManager,
				renderer,
				sprite,
				tile: this,
				tileset,
			})
		})
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {boolean} Whether or not this tile is traversable.
	 */
	get isTraversable() {
		const {
			hasFloor,
			hasObstacles,
		} = this.#layers.reduce((accumulator, sprite) => {
			if (sprite.type === 'empty') {
				return accumulator
			}

			if (sprite.type === 'floor') {
				accumulator.hasFloor = true
			}

			if (!sprite.isTraversable) {
				accumulator.hasObstacles = true
			}

			return accumulator
		}, {
			hasFloor: false,
			hasObstacles: false,
		})

		return hasFloor && !hasObstacles
	}

	/**
	 * @returns {object[]} The sprite stack for this tile.
	 */
	get layers() {
		return this.#layers
	}

	/**
	 * @returns {MapManager} This tiles `MapManager`.
	 */
	get mapManager() {
		return this.#mapManager
	}

	/**
	 * @returns {Vector2} This tiles cell position.
	 */
	get position() {
		return this.#position
	}
}
