/* eslint-disable array-element-newline */
// Local imports
import { Tile } from '../Tile.js'





// Constants
const emptyTile = (new Tile).compile()
const wall = (new Tile).wall().compile()
const wallAdjacentDown = (new Tile).wall().group('down').compile()
const wallAdjacentUp = (new Tile).wall().group('up').compile()
const wallAdjacentVertical = (new Tile).wall().group('vertical').compile()
const greyFloorTile = (new Tile).floor().color('dark grey').compile()
const greyFloorTileFadeLeft = (new Tile).floor().color('dark grey').fade('left').compile()
const greyFloorTileFadeRight = (new Tile).floor().color('dark grey').fade('right').compile()

export default {
	height: 13,
	name: 'Test Map',
	startingPosition: {
		x: 2,
		y: 6,
	},
	tiles: [
		emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile,
		emptyTile, wallAdjacentDown, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wallAdjacentDown, emptyTile,
		emptyTile, wallAdjacentVertical, greyFloorTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, greyFloorTile, wallAdjacentVertical, emptyTile,
		emptyTile, wallAdjacentVertical, greyFloorTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, greyFloorTile, wallAdjacentVertical, emptyTile,
		emptyTile, wallAdjacentUp, greyFloorTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, greyFloorTile, wallAdjacentUp, emptyTile,
		emptyTile, greyFloorTile, greyFloorTile, greyFloorTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, greyFloorTile, greyFloorTile, greyFloorTile, emptyTile,
		greyFloorTileFadeLeft, greyFloorTile, greyFloorTile, greyFloorTile, emptyTile, emptyTile, greyFloorTile, greyFloorTile, emptyTile, emptyTile, greyFloorTile, greyFloorTile, greyFloorTile, greyFloorTileFadeRight,
		emptyTile, greyFloorTile, greyFloorTile, greyFloorTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, greyFloorTile, greyFloorTile, greyFloorTile, emptyTile,
		emptyTile, wallAdjacentDown, greyFloorTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, greyFloorTile, wallAdjacentDown, emptyTile,
		emptyTile, wallAdjacentVertical, greyFloorTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, greyFloorTile, wallAdjacentVertical, emptyTile,
		emptyTile, wallAdjacentVertical, greyFloorTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, greyFloorTile, wallAdjacentVertical, emptyTile,
		emptyTile, wallAdjacentUp, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wallAdjacentUp, emptyTile,
		emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile, emptyTile,
	],
	width: 14,
}
