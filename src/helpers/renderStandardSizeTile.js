// Local imports
import { TILE_SIZE } from '../game/Tile.js'





/**
 * Renders a tile from `tileset` with `renderer`.
 *
 * @param {object} config Configuration for rendering the tile.
 * @param {number} config.destinationX The x position (in pixels) at which the tile will be rendered to the canvas.
 * @param {number} config.destinationY The y position (in pixels) at which the tile will be rendered to the canvas.
 * @param {object} config.renderer The renderer instance which will be used to render this tile.
 * @param {number} config.sourceX The left most position position (in pixels) of the tile in the `tileset` image.
 * @param {number} config.sourceY The top most position position (in pixels) of the tile in the `tileset` image.
 * @param {HTMLImageElement} config.tileset The base image from which the will be rendered.
 */
export function renderStandardSizeTile(config) {
	const {
		destinationX,
		destinationY,
		renderer,
		sourceX,
		sourceY,
		tileset,
	} = config

	renderer.drawImage({
		image: tileset,
		source: {
			height: TILE_SIZE.height,
			width: TILE_SIZE.width,
			x: sourceX,
			y: sourceY,
		},
		destination: {
			height: TILE_SIZE.height,
			width: TILE_SIZE.width,
			x: destinationX,
			y: destinationY,
		},
	})
}
