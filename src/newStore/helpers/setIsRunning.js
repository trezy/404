// Local imports
import { store } from '../store.js'





/**
 * Updates the state to indicate whether the game is currently running.
 *
 * @param {boolean} isRunning Whether the game is currently running.
 */
export const setIsRunning = isRunning => {
	store.set(() => ({ isRunning }))
}
