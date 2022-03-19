// Local imports
import {
	TILE_RENDERERS,
	TILE_SIZE,
} from './Tile.js'
import { LAYERS } from './Renderer.js'





export class Map {
	/****************************************************************************\
	 * Public instance properties
	\****************************************************************************/

	mapData = null





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	constructor(mapData, tileset) {
		this.mapData = mapData
		this.tileset = tileset
	}

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

	get height() {
		return this.mapData.height
	}

	get name() {
		return this.mapData.name
	}

	get tiles() {
		return this.mapData.tiles
	}

	get width() {
		return this.mapData.width
	}
}
