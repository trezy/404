// Module imports
import create from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'





// Local imports
import { SaveManager } from '../game/SaveManager.js'





// Constants
const DEFAULT_SETTINGS_SCENE = 'accessibility'





export const store = create(subscribeWithSelector((set, get) => ({
	mostRecentSaveID: (() => {
		const mostRecentSaveID = localStorage.getItem('debug-game:most-recent-save-id')

		if (mostRecentSaveID) {
			return Number(mostRecentSaveID)
		}

		return null
	})(),
	saveManager: new SaveManager,
	settingsPanel: DEFAULT_SETTINGS_SCENE,

	/**
	 * Change settings panel.
	 *
	 * @param {'accessibility' | 'controls' | 'graphics' | 'sound'} panelName The name of the panel to change to.
	 */
	goToSettingsPanel(panelName) {
		set({ settingsPanel: panelName })
	},
})))

// eslint-disable-next-line jsdoc/require-jsdoc
const showIshihara = () => {
	store.setState({
		scene: 'ishiharaTest',
	})
}

window.showIshihara = showIshihara
