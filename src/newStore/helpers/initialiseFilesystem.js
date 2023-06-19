// Module imports
import { ipcRenderer } from 'electron'





// Local imports
import { executePromiseWithMinimumDuration } from '../../helpers/executePromiseWithMinimumDuration.js'
import { store } from '../store.js'





// Constants
const MINIMUM_DURATION = 2000





/**
 * Ensures all ofthe required local directories have been created.
 */
export async function initialiseFilesystem() {
	const { contentManager } = store.state

	await executePromiseWithMinimumDuration(ipcRenderer.invoke('initialiseDirectories'), MINIMUM_DURATION)
	await contentManager.loadMeta()

	store.set({ isFilesystemInitialised: true })
}
