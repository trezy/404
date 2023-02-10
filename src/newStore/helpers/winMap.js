// Local imports
import { store } from '../store.js'





/**
 * Updates the state to indicate that victory conditions have been met for the current map.
 */
export const winMap = () => {
	store.set(() => ({ isVictorious: true }))
}
