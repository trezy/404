// Module imports
import { app } from 'electron'
import ConfigStore from 'electron-store'
import ElectronSquirrelStartup from 'electron-squirrel-startup'





// Local imports
import { createWindow } from './helpers/createWindow.js'
import { handleActivate } from './helpers/handleActivate.js'
import { handleAllWindowsClosed } from './helpers/handleAllWindowsClosed.js'





// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (ElectronSquirrelStartup) {
	app.quit()
}

ConfigStore.initRenderer()

app.on('activate', handleActivate)
app.on('ready', createWindow)
app.on('window-all-closed', handleAllWindowsClosed)
