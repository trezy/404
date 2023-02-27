// Local imports
import { ACTIONS } from './ACTIONS.js'
import { moveCursor } from '../newStore/helpers/moveCursor.js'
import { placeTileset } from '../newStore/helpers/placeTileset.js'
import { skipGracePeriod } from '../newStore/helpers/skipGracePeriod.js'





export const ACTION_HANDLERS = {
	[ACTIONS.MOVE_CURSOR_RIGHT]: () => moveCursor(1, 0),

	[ACTIONS.MOVE_CURSOR_UP]: () => moveCursor(0, -1),

	[ACTIONS.MOVE_CURSOR_DOWN]: () => moveCursor(0, 1),

	[ACTIONS.MOVE_CURSOR_LEFT]: () => moveCursor(-1, 0),

	[ACTIONS.PLACE_TILESET]: () => placeTileset(),

	[ACTIONS.SKIP_TIMER]: () => skipGracePeriod(),
}
