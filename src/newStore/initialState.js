// Local imports
import { configStore } from '../helpers/configStore.js'
import { ContentManager } from '../game/ContentManager.js'
import { ControlsManager } from '../game/ControlsManager.js'
import { LOADING_GAME } from '../constants/SceneNames.js'





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

	/** @type {null | import('../game2/structures/Vector2.js').Vector2} */
	currentDestination: null,

	/** @type {null | Array} */
	currentPath: null,

	/** @type {string} */
	currentSettingsPanel: 'accessibility',

	/** @type {null | import('../game2/structures/TileMapManager.js').TileMapManager} */
	currentTileset: null,

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

	/** @type {null | KeyboardLayoutMap} */
	keyboardLayoutMap: null,

	/** @type {number} */
	lastCursorUpdate: 0,

	/** @type {number} */
	lastPlaceUpdate: 0,

	/** @type {null | import('../game2/structures/TileMapManager.js').TileMapManager} */
	map: null,

	/** @type {null | string} */
	mapID: null,

	/** @type {number} */
	mostRecentSaveID: configStore.get('mostRecentSaveID'),

	/** @type {number} */
	now: performance.now(),

	/** @type {null | import('pixi.js').Application} */
	pixiApp: null,

	/** @type {null | import('../game2/structures/RobotManager.js').RobotManager} */
	robot: null,

	/** @type {string[]} */
	sceneHistory: [LOADING_GAME],

	/** @type {object} */
	spriteCache: {},

	/** @type {null | import('../game2/structures/TileMapManager.js').TileMapManager[]} */
	tilesetQueue: null,

	/** @type {number} */
	time: 0,

	/** @type {number} */
	timeDelta: 0,

	/** @type {null | number} */
	timerGracePeriod: null,

	/** @type {null | number} */
	timerPathfindingStartedAt: null,

	/** @type {null | number} */
	timerStartDelta: null,

	/** @type {null | number} */
	timerStartedAt: null,

	/** @type {null | number} */
	timerStoppedAt: null,

	/** @type {string} */
	timerString: '00:00',

	/** @type {null | import('pixi-viewport').Viewport} */
	viewport: null,
}
