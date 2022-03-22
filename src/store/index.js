// Module imports
import create from 'zustand/vanilla'





// Local imports
import { GameManager } from '../game/GameManager.js'
import { Map } from '../game/Map.js'
import { SaveManager } from '../game/SaveManager.js'





// Constants
const FRAME_BUFFER = []

export const store = create((set, get) => ({
	currentMap: null,
	currentScene: 'loadingGame',
	fps: 0,
	frame: 0,
	isRunning: false,
	gameManager: new GameManager,
	map: null,
	mostRecentSaveID: (() => {
		const mostRecentSaveID = localStorage.getItem('debug-game:most-recent-save-id')

		if (mostRecentSaveID) {
			return Number(mostRecentSaveID)
		}

		return null
	})(),
	tileset: null,
	timeDelta: 0,
	time: 0,
	saveID: null,
	saveManager: new SaveManager,

	/**
	 * Switch to the map loading scene.
	 *
	 * @param {string} mapID The ID of the map to be loaded.
	 */
	goToLoadingMap(mapID) {
		set({
			currentMap: mapID,
			currentScene: 'loadingMap',
		})
	},

	/**
	 * Switch to the map select scene. Also sets the saveID if one is passed.
	 *
	 * @param {number} [saveID] The ID of the save that has been selected.
	 */
	goToMapSelect(saveID) {
		const {
			saveID: currentSaveID,
			saveManager,
		} = get()

		if (!currentSaveID && !saveID) {
			({ id: saveID } = saveManager.createSave())
		}

		set(state => {
			localStorage.setItem('debug-game:most-recent-save-id', saveID || state.saveID)

			return {
				currentScene: 'mapSelect',
				currentMap: null,
				mostRecentSaveID: saveID || state.saveID,
				saveID: saveID || state.saveID,
			}
		})

	},

	/**
	 * Switch to the main title scene.
	 */
	goToTitle() {
		set({
			currentMap: null,
			currentScene: 'title',
			saveID: null,
		})
	},

	/**
	 * Switch to the game settings scene.
	 */
	goToSettings() {
		set({ currentScene: 'settings' })
	},

	/**
	 * Switch to the save select scene.
	 */
	goToSaveSelect() {
		set({
			currentMap: null,
			currentScene: 'saveSelect',
			saveID: null,
		})
	},

	/**
	 * Load the currently selected map. Also initiates preloading of the tileset.
	 */
	async loadMap(){
		const {
			currentMap,
			preloadTileset,
		} = get()

		const { default: mapData } = await import(/* @vite-ignore */ `/maps/${currentMap}.js`)

		const tileset = await preloadTileset()

		set({
			currentScene: 'play',
			map: new Map(mapData, tileset),
			tileset,
		})
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

	/**
	 * Preload the game's tileset.
	 */
	async preloadTileset() {
		const tileset = new Image

		tileset.src = '/tileset.png'

		await tileset.decode()

		return tileset
	},
}))
