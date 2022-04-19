/* eslint-disable array-element-newline */

const exitTile = {
	type: 'exit',
}
const floorTile = {
	color: 'dark grey',
	type: 'floor',
}
const wallTile = { type: 'wall' }

export default {
	height: 13,
	name: 'Test Map',
	startingPosition: {
		x: 2,
		y: 6,
	},
	tiles: [
		[
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, floorTile, null, null, null, null, null, null, null, null, floorTile, null, null,
			null, null, floorTile, null, floorTile, floorTile, floorTile, null, null, null, null, floorTile, null, null,
			null, null, floorTile, null, floorTile, null, floorTile, null, null, null, null, floorTile, null, null,
			null, floorTile, floorTile, null, floorTile, null, floorTile, null, null, null, null, floorTile, floorTile, null,
			floorTile, floorTile, floorTile, floorTile, floorTile, null, floorTile, null, floorTile, floorTile, floorTile, floorTile, floorTile, floorTile,
			null, floorTile, floorTile, null, null, null, floorTile, null, floorTile, null, null, floorTile, floorTile, null,
			null, null, floorTile, null, null, null, floorTile, null, floorTile, null, null, floorTile, null, null,
			null, null, floorTile, null, null, null, floorTile, floorTile, floorTile, null, null, floorTile, null, null,
			null, null, floorTile, null, null, null, null, null, null, null, null, floorTile, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
		],
		[
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, null,
			null, wallTile, null, null, null, null, null, null, null, null, null, null, wallTile, null,
			null, wallTile, null, null, null, null, null, null, null, null, null, null, wallTile, null,
			null, wallTile, null, null, null, null, null, null, null, null, null, null, wallTile, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, wallTile, null, null, null, null, null, null, null, null, null, null, wallTile, null,
			null, wallTile, null, null, null, null, null, null, null, null, null, null, wallTile, null,
			null, wallTile, null, null, null, null, null, null, null, null, null, null, wallTile, null,
			null, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, wallTile, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
		],
		[
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, exitTile, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null, null, null, null, null, null,
		],
	],
	width: 14,
}
