// Module imports
import create from 'zustand/vanilla'





// Local imports
import { GameManager } from '../game/GameManager.js'
import { SaveManager } from '../game/SaveManager.js'





// Constants
const DEFAULT_SETTINGS_SCENE = 'accessibility'
const FRAME_BUFFER = []





export const store = create((set, get) => ({
	controlsManager: null,
	frame: 0,
	fps: 0,
	gameManager: new GameManager,
	isRunning: false,
	mapID: null,
	mapManager: null,
	mostRecentSaveID: (() => {
		const mostRecentSaveID = localStorage.getItem('debug-game:most-recent-save-id')

		if (mostRecentSaveID) {
			return Number(mostRecentSaveID)
		}

		return null
	})(),
	previousScene: null,
	timeDelta: 0,
	time: 0,
	saveID: null,
	saveManager: new SaveManager,
	scene: 'loadingGame',
	settingsPanel: DEFAULT_SETTINGS_SCENE,

	/**
	 * Go back to the previous scene.
	 */
	goBack() {
		const {
			goToScene,
			previousScene,
		} = get()

		goToScene(previousScene)
	},

	/**
	 * Switch to the map loading scene.
	 *
	 * @param {string} mapID The ID of the map to be loaded.
	 */
	goToLoadingMap(mapID) {
		const { goToScene } = get()

		goToScene('loadingMap', { mapID })
	},

	/**
	 * Switch to the map select scene. Also sets the saveID if one is passed.
	 *
	 * @param {number} [saveID] The ID of the save that has been selected.
	 */
	goToMapSelect(saveID) {
		const {
			goToScene,
			saveID: currentSaveID,
			saveManager,
		} = get()

		if (!currentSaveID && !saveID) {
			({ id: saveID } = saveManager.createSave())
		}

		localStorage.setItem('debug-game:most-recent-save-id', saveID || currentSaveID)

		goToScene('mapSelect', {
			mapID: null,
			mostRecentSaveID: saveID || currentSaveID,
			saveID: saveID || currentSaveID,
		})
	},

	/**
	 * Switch to the save select scene.
	 */
	goToSaveSelect() {
		const { goToScene } = get()

		goToScene('saveSelect', {
			mapID: null,
			saveID: null,
		})
	},

	/**
	 * Change the scene.
	 *
	 * @param {string} sceneName The key of the scene to switch to.
	 * @param {object} [options] Additional keys to be set in the state.
	 */
	goToScene(sceneName, options = {}) {
		set(state => ({
			scene: sceneName,
			previousScene: state.scene,
			...options,
		}))
	},

	/**
	 * Switch to the game settings scene.
	 */
	goToSettings() {
		const { goToScene } = get()

		goToScene('settings', {
			settingsPanel: DEFAULT_SETTINGS_SCENE,
		})
	},

	/**
	 * Change settings panel.
	 *
	 * @param {'accessibility' | 'controls' | 'graphics' | 'sound'} panelName The name of the panel to change to.
	 */
	goToSettingsPanel(panelName) {
		set({ settingsPanel: panelName })
	},

	/**
	 * Switch to the main title scene.
	 */
	goToTitle() {
		const { goToScene } = get()

		goToScene('title', {
			mapID: null,
			saveID: null,
		})
	},

	/**
	 * Load the currently selected map. Also initiates preloading of the tileset.
	 */
	async loadMap() {
		const {
			gameManager,
			mapID,
			goToScene,
		} = get()

		await gameManager.loadMap(mapID)

		goToScene('play', { mapManager: gameManager.mapManager })
	},

	/**
	 * Updates the frame buffer and current FPS.
	 */
	nextFrame() {
		const now = performance.now()

		FRAME_BUFFER.push(now)

		const oneSecondAgo = now - 1000
		while (FRAME_BUFFER[0] < oneSecondAgo) {
			FRAME_BUFFER.shift()
		}

		set(state => ({
			fps: FRAME_BUFFER.length,
			frame: state.frame + 1,
			time: now,
			timeDelta: now - state.time,
		}))
	},
}))

store.setState(state => {
	return {
		controlsManager: state.gameManager.controlsManager,
	}
})
