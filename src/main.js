// Module imports
import {
	app,
	ipcMain,
} from 'electron'
import ElectronSquirrelStartup from 'electron-squirrel-startup'





// Local imports
import './helpers/configStore.js'
import { createWindow } from './helpers/createWindow.js'
import { handleActivate } from './helpers/handleActivate.js'
import { handleAllWindowsClosed } from './helpers/handleAllWindowsClosed.js'
import { handleGetDisplaysInformation } from './helpers/handleGetDisplaysInformation.js'
import { handleGetFonts } from './helpers/handleGetFonts.js'





// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (ElectronSquirrelStartup) {
	app.quit()
}

app.on('activate', handleActivate)
app.on('ready', createWindow)
app.on('window-all-closed', handleAllWindowsClosed)

ipcMain.handle('getFonts', handleGetFonts)
ipcMain.handle('getDisplaysInformation', handleGetDisplaysInformation)
