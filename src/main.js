// Module imports
import {
	app,
	// ipcMain,
} from 'electron'
import ConfigStore from 'electron-store'
import ElectronSquirrelStartup from 'electron-squirrel-startup'





// Local imports
import { createWindow } from './helpers/createWindow.js'
import { handleActivate } from './helpers/handleActivate.js'
import { handleAllWindowsClosed } from './helpers/handleAllWindowsClosed.js'
// import { handleGetAllGameSaves } from './helpers/handleGetAllGameSaves.js'
// import { handleLoadGame } from './helpers/handleLoadGame.js'





// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (ElectronSquirrelStartup) { // eslint-disable-line global-require
	app.quit()
}

ConfigStore.initRenderer()

app.on('activate', handleActivate)
app.on('ready', createWindow)
app.on('window-all-closed', handleAllWindowsClosed)

// ipcMain.handle('getAllGameSaves', async (_, ...args) => handleGetAllGameSaves(...args))
// ipcMain.handle('loadGame', async (_, ...args) => handleLoadGame(...args))
