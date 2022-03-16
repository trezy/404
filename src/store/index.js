// Module imports
import create from 'zustand/vanilla'





// Local imports
import { GameManager } from '../game/GameManager.js'





// Constants
const FRAME_BUFFER = []





const store = create((set, get) => ({
	currentMap: null,
	fps: 0,
	frame: 0,
	isRunning: false,
	gameManager: new GameManager,
	timeDelta: 0,
	time: 0,

	goToPlay: mapID => {
		console.log(`TODO: load map loading scene for map ${mapID}`)
	},

	goToTitle: () => {
		set({ currentScene: 'title' })
	},

	goToSettings: () => {
		set({ currentScene: 'settings' })
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
}))

export { store }
