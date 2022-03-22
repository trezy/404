// Local imports
import { renderStandardSizeTile } from '../helpers/renderStandardSizeTile.js'





export const TILE_SIZE = {
	height: 16,
	width: 16,
}

export const TILE_RENDERERS = [
	// empty
	() => {},

	// wall
	(rendererConfig, tileConfig) => {
		const {
			destinationY,
			renderer,
		} = rendererConfig

		let sourceX = 144
		let sourceY = 48

		switch (tileConfig.grouping) {
			case 'down':
				sourceY = 16
				break

			case 'up':
				sourceX = 112
				break

			case 'vertical':
				sourceX = 112
				sourceY = 16
				break

			default:
				break
		}

		renderStandardSizeTile({
			...rendererConfig,
			sourceX,
			sourceY,
		})

		renderer.setAlpha(0.5)
		renderStandardSizeTile({
			...rendererConfig,
			destinationY: destinationY + TILE_SIZE.height,
			sourceX: 16,
			sourceY: 176,
		})
		renderer.setAlpha(1)
	},

	// floor
	(rendererConfig, tileConfig) => {
		const {
			color,
			fade = false,
		} = tileConfig
		const baseX = 48
		const baseY = 176

		let xMod = 0
		let yMod = 0

		switch (color) {
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

		switch (fade) {
			case 'down':
				yMod = 2
				break

			case 'left':
				yMod = 1
				break

			case 'right':
				yMod = 3
				break

			case 'up':
				yMod = 4
				break

			// no fade
			default:
				yMod = 0
		}

		renderStandardSizeTile({
			...rendererConfig,
			sourceX: baseX + (xMod * TILE_SIZE.width * 2),
			sourceY: baseY + (yMod * TILE_SIZE.height * 2),
		})
	},
]

/**
 * Constructs a tile config that can be compiled and used in map files.
 */
export class Tile {
	hasShadow = {}
	tileConfig = {}
	tileType = 'empty'

	/**
	 * Sets the color to be used for floor tiles.
	 *
	 * @param {'dark grey' | 'green' | 'hazard' | 'grey' | 'orange' | 'red'} color The floor color to be used for this tile.
	 * @returns {Tile} The initial tile instance; useful for chaining.
	 */
	color(color) {
		if (this.tileType !== 'floor') {
			throw new Error('Tile.color() method is only allowed for tiles of type `floor`')
		}

		this.tileConfig.color = color
		return this
	}

	/**
	 * Sets the fade direction for floor tiles.
	 *
	 * @param {'down' | 'left' | 'right' | 'up'} fadeDirection The direction to fade the tile.
	 * @returns {Tile} The initial tile instance; useful for chaining.
	 */
	fade(fadeDirection) {
		if (this.tileType !== 'floor') {
			throw new Error('Tile.color() method is only allowed for tiles of type `floor`')
		}

		this.tileConfig.fade = fadeDirection
		return this
	}

	/**
	 * Sets this tile to type `floor`.
	 *
	 * @returns {Tile} The initial tile instance; useful for chaining.
	 */
	floor() {
		this.tileType = 'floor'
		return this
	}

	/**
	 * Compiles the tile's config object for use in map files.
	 *
	 * @returns {number | Array} The config to be used in map files.
	 */
	compile() {
		if (Object.keys(this.tileConfig).length) {
			return [
				this.rendererIndex,
				this.tileConfig,
			]
		}

		return this.rendererIndex
	}

	/**
	 * Sets the grouping value for wall tiles.
	 *
	 * @param {'down' | 'up' | 'vertical'} grouping Which sides of this wall tile are adjacent to other wall tiles.
	 * @returns {Tile} The initial tile instance; useful for chaining.
	 */
	group(grouping) {
		if (this.tileType !== 'wall') {
			throw new Error('Tile.group() method is only allowed for tiles of type `wall`')
		}

		this.tileConfig.grouping = grouping

		return this
	}

	/**
	 * Sets this tile to type `wall`.
	 *
	 * @returns {Tile} The initial tile instance; useful for chaining.
	 */
	wall() {
		this.tileType = 'wall'
		return this
	}

	/**
	 * Determines which renderer function will be used for this tile.
	 *
	 * @returns {0 | 1 | 2} The index of the renderer function to be used for this tile.
	 */
	get rendererIndex() {
		switch (this.tileType) {
			case 'wall':
				return 1

			case 'floor':
				return 2

			default:
				return 0
		}
	}
}
