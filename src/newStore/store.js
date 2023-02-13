// Module imports
import { makeStore } from 'statery'





// Local imports
import { initialState } from './initialState.js'





export const store = makeStore(initialState)

navigator.keyboard.getLayoutMap().then(keyboardLayoutMap => {
	store.set(() => ({ keyboardLayoutMap }))
})
