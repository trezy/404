// Module imports
import create from 'zustand/vanilla'





// Local imports
import { GameManager } from '../game/GameManager.js'
import { Map } from '../game/Map.js'





// Constants
const FRAME_BUFFER = []





const store = create((set, get) => ({
	currentMap: null,
	fps: 0,
	frame: 0,
	isRunning: false,
	gameManager: new GameManager,
	map: null,
	tileset: null,
	timeDelta: 0,
	time: 0,

	goToLoadingMap: mapID => {
		set({
			currentMap: mapID,
			currentScene: 'loadingMap',
		})
	},

	goToMapSelect: () => {
		set({ currentScene: 'mapSelect' })
	},

	goToTitle: () => {
		set({ currentScene: 'title' })
	},

	goToSettings: () => {
		set({ currentScene: 'settings' })
	},

	loadMap: async () => {
		const {
			currentMap,
			preloadTileset,
		} = get()

		const { default: mapData } = await import(`/maps/${currentMap}.js`)

		const tileset = await preloadTileset()

		set({
			currentScene: 'play',
			map: new Map(mapData, tileset),
			tileset,
		})
	},

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

	preloadTileset: async () => {
		const tileset = new Image

		tileset.src = '/tileset.png'

		await tileset.decode()

		return tileset
	},
}))

export { store }
