// Local imports
import { Timer } from '../game/Timer.js'





export const initialState = {
	cursorOffset: {
		x: 0,
		y: 0,
	},
	fps: 0,
	frame: 0,
	globalOffset: {
		x: 0,
		y: 0,
	},
	mapManager: null,
	time: 0,
	timeDelta: 0,
	timer: new Timer,
	timerString: '00:00',
}
