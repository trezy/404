// Module imports
import create from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'





// Local imports
import {
	ARCHITECT,
	CUSTOM_GAME,
	LOADING_GAME,
	LOADING_MAP,
	MAIN_MENU,
	MAP_EDITOR,
	MAP_SELECT,
	PLAY,
	SAVE_SELECT,
	SETTINGS,
} from '../constants/SceneNames.js'
import { GameManager } from '../game/GameManager.js'
import { SaveManager } from '../game/SaveManager.js'





// Constants
const DEFAULT_SETTINGS_SCENE = 'accessibility'
const FRAME_BUFFER = []





export const store = create(subscribeWithSelector((set, get) => ({
	contentManager: null,
	controlsManager: null,
	frame: 0,
	fps: 0,
	gameManager: new GameManager,
	globalOffset: {
		x: 0,
		y: 0,
	},
	isCampaignMenuVisible: false,
	isCustomGameMenuVisible: false,
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
	scene: LOADING_GAME,
	settingsPanel: DEFAULT_SETTINGS_SCENE,

	/**
	 * Go back to the previous scene.
	 */
	goBack() {
		const {
			// @ts-ignore
			goToScene,
			// @ts-ignore
			previousScene,
		} = get()

		goToScene(previousScene)
	},

	/**
	 * Switch to the map editor scene.
	 */
	goToArchitect() {
		// @ts-ignore
		const { goToScene } = get()

		goToScene(ARCHITECT)
	},

	/**
	 * Switch to the custom game scene.
	 */
	goToCustomGame() {
		// @ts-ignore
		const { goToScene } = get()

		goToScene(CUSTOM_GAME)
	},

	/**
	 * Switch to the map loading scene.
	 *
	 * @param {string} mapID The ID of the map to be loaded.
	 */
	goToLoadingMap(mapID) {
		// @ts-ignore
		const { goToScene } = get()

		goToScene(LOADING_MAP, { mapID })
	},

	/**
	 * Switch to the main title scene.
	 */
	goToMainMenu() {
		// @ts-ignore
		const { goToScene } = get()

		goToScene(MAIN_MENU, {
			mapID: null,
			saveID: null,
		})
	},

	/**
	 * Switch to the map editor scene.
	 */
	goToMapEditor() {
		// @ts-ignore
		const { goToScene } = get()

		goToScene(MAP_EDITOR)
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

		goToScene(MAP_SELECT, {
			mapID: null,
			mostRecentSaveID: saveID || currentSaveID,
			saveID: saveID || currentSaveID,
		})
	},

	/**
	 * Switch to the save select scene.
	 */
	goToSaveSelect() {
		// @ts-ignore
		const { goToScene } = get()

		goToScene(SAVE_SELECT, {
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
			// @ts-ignore
			previousScene: state.scene,
			...options,
		}))
	},

	/**
	 * Switch to the game settings scene.
	 */
	goToSettings() {
		// @ts-ignore
		const { goToScene } = get()

		goToScene(SETTINGS, {
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
	 * Load the currently selected map. Also initiates preloading of the tileset.
	 */
	async loadMap() {
		const {
			gameManager,
			goToScene,
			mapID,
		} = get()

		await gameManager.loadMap(mapID)

		goToScene(PLAY, { mapManager: gameManager.mapManager })
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
			// @ts-ignore
			frame: state.frame + 1,
			time: now,
			// @ts-ignore
			timeDelta: now - state.time,
		}))
	},

	/**
	 * Sets the renderer offset to a specific value.
	 */
	setOffset(x, y) {
		set(() => {
			return {
				globalOffset: {
					x,
					y,
				},
			}
		})
	},
})))

store.setState(state => {
	return {
		contentManager: state.gameManager.contentManager,
		controlsManager: state.gameManager.controlsManager,
	}
})

// eslint-disable-next-line jsdoc/require-jsdoc
const showIshihara = () => {
	store.setState({
		scene: 'ishiharaTest',
	})
}

window.showIshihara = showIshihara
