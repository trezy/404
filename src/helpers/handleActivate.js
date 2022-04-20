// Module imports
import { BrowserWindow } from 'electron'





// Local imports
import { createWindow } from './createWindow.js'





export function handleActivate() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
}
