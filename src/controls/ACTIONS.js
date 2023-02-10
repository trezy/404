// Local imports
import { moveCursor } from '../newStore/helpers/moveCursor.js'
import { placeTileset } from '../newStore/helpers/placeTileset.js'
import { skipGracePeriod } from '../newStore/helpers/skipGracePeriod.js'





export const ACTIONS = [
	{
		label: 'Move Cursor East',
		bindings: {
			keyboard: 'd',
		},
		handler() {
			moveCursor(1, 0)
		},
		repeatFrequency: 150,
	},

	{
		label: 'Move Cursor North',
		bindings: {
			keyboard: 'w',
		},
		handler() {
			moveCursor(0, -1)
		},
		repeatFrequency: 150,
	},

	{
		label: 'Move Cursor South',
		bindings: {
			keyboard: 's',
		},
		handler() {
			moveCursor(0, 1)
		},
		repeatFrequency: 150,
	},

	{
		label: 'Move Cursor West',
		bindings: {
			keyboard: 'a',
		},
		handler() {
			moveCursor(-1, 0)
		},
		repeatFrequency: 150,
	},

	{
		label: 'Place Tile',
		bindings: {
			keyboard: ' ',
		},
		handler() {
			placeTileset()
		},
	},

	{
		label: 'Begin Pathfinding',
		bindings: {
			keyboard: 'enter',
		},
		handler() {
			skipGracePeriod()
		},
	},
]
