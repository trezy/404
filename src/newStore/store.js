// Module imports
import { makeStore } from 'statery'





// Local imports
import { initialState } from './initialState.js'





export const store = makeStore(initialState)

/**
 * Retrieve and update the keyboard layout.
 */
navigator.keyboard.getLayoutMap().then(keyboardLayoutMap => {
	store.set(() => ({ keyboardLayoutMap }))
})

/**
 * Retrieve and update the most recent save.
 */
const mostRecentSaveID = localStorage.getItem('debug-game:most-recent-save-id')

if (mostRecentSaveID) {
	store.set(() => ({
		mostRecentSaveID: Number(mostRecentSaveID)
	}))
}
