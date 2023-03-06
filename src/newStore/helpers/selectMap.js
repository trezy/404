// Local imports
import { store } from '../store.js'





/**
 * Selects a map to be loaded.
 */
export const selectMap = mapID => store.set(() => ({ mapID }))
