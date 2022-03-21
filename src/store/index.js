// Module imports
import create from 'zustand/vanilla'

// Local imports
import { GameManager } from '../game/GameManager.js'
import { Map } from '../game/Map.js'

// Constants
const FRAME_BUFFER = []

export const store = create((set, get) => ({
	currentMap: null,
	currentScene: 'mapSelect',
	fps: 0,
	frame: 0,
	isRunning: false,
	gameManager: new GameManager(),
	map: null,
	tileset: null,
	timeDelta: 0,
	time: 0,
	saveID: null,

	/**
	 * Switch to the map loading scene.
	 *
	 * @param {string} mapID The ID of the map to be loaded.
	 */
	goToLoadingMap: mapID => {
		set({
			currentMap: mapID,
			currentScene: 'loadingMap',
		})
	},

	/**
	 * Switch to the map select scene.
	 */
	goToMapSelect: () => {
		set({ currentScene: 'mapSelect' })
	},

	/**
	 * Switch to the main title scene.
	 */
	goToTitle: () => {
		set({ currentScene: 'title' })
	},


	/**
	 * Switch to the game settings scene.
	 */
	goToSettings: () => {
		set({ currentScene: 'settings' })
	},

	/**
	 *
	 */
	goToSaveSelect() {
		set({ currentScene: 'saveSelect' })
	},

	/**
	 * Load the currently selected map. Also initiates preloading of the tileset.
	 */
	loadMap: async () => {
		const { currentMap, preloadTileset } = get()

		const { default: mapData } = await import(/* @vite-ignore */ `/maps/${currentMap}.js`)

		const tileset = await preloadTileset()

		set({
			currentScene: 'play',
			map: new Map(mapData, tileset),
			tileset,
		})
	},

	/**
	 *
	 * @param id
	 */
	loadSave(id) {
		set({
			currentScene: 'mapSelect',
			saveID: id,
		})
	},

	/**
	 * Updates the frame buffer and current FPS.
	 */
	nextFrame: () => {
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
	preloadTileset: async () => {
		const tileset = new Image()

		tileset.src = '/tileset.png'

		await tileset.decode()

		return tileset
	},
}))
