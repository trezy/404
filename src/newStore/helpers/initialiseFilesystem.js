// Module imports
import { ipcRenderer } from 'electron'





// Local imports
import { store } from '../store.js'





/**
 * Ensures all ofthe required local directories have been created.
 */
export async function initialiseFilesystem() {
	const { contentManager } = store.state

	await ipcRenderer.invoke('initialiseDirectories')
	await contentManager.loadMeta()

	store.set(() => ({ isFilesystemInitialised: true }))
}
