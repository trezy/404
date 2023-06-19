// Local imports
import { configStore } from '../helpers/configStore.js'
import { ContentManager } from '../game/ContentManager.js'
import { ControlsManager } from '../game/ControlsManager.js'
import { LOADING_GAME } from '../constants/SceneNames.js'
import { MapManager } from '../game/MapManager.js'





export const initialState = {
	/** @type {boolean} */
	areAssetsLoaded: false,

	/** @type {number} */
	assetLoadingProgress: 0,

	/** @type {object} */
	controls: configStore.get('settings.controls'),

	/** @type {ContentManager} */
	contentManager: new ContentManager,

	/** @type {ControlsManager} */
	controlsManager: new ControlsManager,

	/** @type {string} */
	currentSettingsPanel: 'accessibility',

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
	isFilesystemInitialised: false,

	/** @type {boolean} */
	isInitialisingFilesystem: false,

	/** @type {boolean} */
	isLoadingAssets: false,

	/** @type {boolean} */
	isPauseModalVisible: false,

	/** @type {boolean} */
	isRunning: false,

	/** @type {boolean} */
	isSettingUpPixi: false,

	/** @type {boolean} */
	isUploadingAssetsToGPU: false,

	/** @type {boolean} */
	isVictorious: false,

	/** @type {KeyboardLayoutMap} */
	keyboardLayoutMap: null,

	/** @type {number} */
	lastCursorUpdate: 0,

	/** @type {number} */
	lastPlaceUpdate: 0,

	/** @type {string} */
	mapID: null,

	/** @type {MapManager} */
	mapManager: null,

	/** @type {number} */
	mostRecentSaveID: configStore.get('mostRecentSaveID'),

	/** @type {number} */
	now: performance.now(),

	/** @type {import('pixi.js').Application} */
	pixiApp: null,

	/** @type {import('pixi.js').AnimatedSprite} */
	robotSprite: null,

	/** @type {string[]} */
	sceneHistory: [LOADING_GAME],

	/** @type {object} */
	spriteCache: {},

	/** @type {number} */
	time: 0,

	/** @type {number} */
	timeDelta: 0,

	/** @type {number | null} */
	timerGracePeriod: null,

	/** @type {number | null} */
	timerPathfindingStartedAt: null,

	/** @type {number | null} */
	timerStartDelta: null,

	/** @type {number | null} */
	timerStartedAt: null,

	/** @type {string} */
	timerString: '00:00',

	/** @type {import('pixi-viewport').Viewport} */
	viewport: null,
}
