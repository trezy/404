// Local imports
import { configStore } from '../helpers/configStore.js'
import { ContentManager } from '../game/ContentManager.js'
import { ControlsManager } from '../game/ControlsManager.js'
import { GameManager } from '../game/GameManager.js'
import { LOADING_GAME } from '../constants/SceneNames.js'
import { MapManager } from '../game/MapManager.js'
import { Timer } from '../game/Timer.js'





export const initialState = {
	/** @type {object} */
	controls: configStore.get('settings.controls'),

	/** @type {ContentManager} */
	contentManager: new ContentManager,

	/** @type {ControlsManager} */
	controlsManager: new ControlsManager,

	/** @type {GameManager} */
	gameManager: null,

	/** @type {object} */
	cursorOffset: {
		x: 0,
		y: 0,
	},

	/** @type {number} */
	fps: 0,

	/** @type {number} */
	frame: 0,

	/** @type {object} */
	globalOffset: {
		x: 0,
		y: 0,
	},

	/** @type {boolean} */
	isPauseModalVisible: false,

	/** @type {boolean} */
	isRunning: false,

	/** @type {boolean} */
	isVictorious: false,

	/** @type {KeyboardLayoutMap} */
	keyboardLayoutMap: null,

	/** @type {string} */
	mapID: null,

	/** @type {MapManager} */
	mapManager: null,

	/** @type {string[]} */
	sceneHistory: [LOADING_GAME],

	/** @type {string} */
	currentSettingsPanel: 'accessibility',

	/** @type {number} */
	time: 0,

	/** @type {number} */
	timeDelta: 0,

	/** @type {Timer} */
	timer: new Timer,

	/** @type {string} */
	timerString: '00:00',
}
