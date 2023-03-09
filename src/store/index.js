// Module imports
import create from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'





// Local imports
import { SaveManager } from '../game/SaveManager.js'





export const store = create(subscribeWithSelector((set, get) => ({
	mostRecentSaveID: (() => {
		const mostRecentSaveID = localStorage.getItem('debug-game:most-recent-save-id')

		if (mostRecentSaveID) {
			return Number(mostRecentSaveID)
		}

		return null
	})(),
	saveManager: new SaveManager,
})))

// eslint-disable-next-line jsdoc/require-jsdoc
const showIshihara = () => {
	store.setState({
		scene: 'ishiharaTest',
	})
}

window.showIshihara = showIshihara
