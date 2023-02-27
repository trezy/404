// Local imports
import { configStore } from '../helpers/configStore.js'
import { Timer } from '../game/Timer.js'





export const initialState = {
	controls: configStore.get('settings.controls'),
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
	isVictorious: false,
	keyboardLayoutMap: null,
	mapManager: null,
	time: 0,
	timeDelta: 0,
	timer: new Timer,
	timerString: '00:00',
}
