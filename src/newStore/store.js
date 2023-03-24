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
 * Start the control manager
 */
store.state.controlsManager.start()
