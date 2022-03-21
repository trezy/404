// Local imports
import {
	LAYERS,
	Renderer,
} from './Renderer.js'
import {
	TILE_RENDERERS,
	TILE_SIZE,
} from './Tile.js'





/**
 * Represents a game map.
 */
export class Map {
	/****************************************************************************\
	 * Public instance properties
	\****************************************************************************/

	mapData = null





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Creates a new map.
	 *
	 * @param {object} mapData The contents of the original map file.
	 * @param {Image} tileset The image from which tiles should be rendered.
	 */
	constructor(mapData, tileset) {
		this.mapData = mapData
		this.tileset = tileset
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
					tileset: this.tileset,
				}, tileConfig)
			}
		})
	}





	/****************************************************************************\
	 * Public instance getters
	\****************************************************************************/

	/**
	 * Convenience getter for the map's height (in grid cells).
	 *
	 * @returns {number} The map's height.
	 */
	get height() {
		return this.mapData.height
	}

	/**
	 * Convenience getter for the map's name.
	 *
	 * @returns {string} The map's name.
	 */
	get name() {
		return this.mapData.name
	}

	/**
	 * Convenience getter for the map's tile array.
	 *
	 * @returns {Array} An array of tile configs.
	 */
	get tiles() {
		return this.mapData.tiles
	}

	/**
	 * Convenience getter for the map's width (in grid cells).
	 *
	 * @returns {number} The map's width.
	 */
	get width() {
		return this.mapData.width
	}
}
