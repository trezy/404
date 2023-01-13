// Module imports
import {
	app,
	ipcMain,
} from 'electron'
import ElectronSquirrelStartup from 'electron-squirrel-startup'





// Local imports
import { configStore } from './helpers/configStore.js'
import { createWindow } from './helpers/createWindow.js'
import { handleActivate } from './helpers/handleActivate.js'
import { handleAllWindowsClosed } from './helpers/handleAllWindowsClosed.js'
import { handleDisplayModeChanged } from './helpers/handleDisplayModeChanged.js'
import { handleExportTileset } from './helpers/handleExportTileset.js'
import { handleGetContentMeta } from './helpers/handleGetContentMeta.js'
import { handleGetDisplaysInformation } from './helpers/handleGetDisplaysInformation.js'
import { handleGetFonts } from './helpers/handleGetFonts.js'
import { handleInitialiseContentWatcher } from './helpers/handleInitialiseContentWatcher.js'
import { handleInitialiseDirectories } from './helpers/handleInitialiseDirectories.js'
import { handleLoadResourcepack } from './helpers/handleLoadResourcepack.js'
import { handleSaveMap } from './helpers/handleSaveMap.js'
import { handleSaveTileset } from './helpers/handleSaveTileset.js'





// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (ElectronSquirrelStartup) {
	app.quit()
}

app.on('activate', handleActivate)
app.on('ready', createWindow)
app.on('window-all-closed', handleAllWindowsClosed)

ipcMain.handle('exportTileset', handleExportTileset)
ipcMain.handle('getContentMeta', handleGetContentMeta)
ipcMain.handle('getDisplaysInformation', handleGetDisplaysInformation)
ipcMain.handle('getFonts', handleGetFonts)
ipcMain.handle('initialiseContentWatcher', handleInitialiseContentWatcher)
ipcMain.handle('initialiseDirectories', handleInitialiseDirectories)
ipcMain.handle('loadResourcepack', handleLoadResourcepack)
ipcMain.handle('saveMap', handleSaveMap)
ipcMain.handle('saveTileset', handleSaveTileset)

configStore.onDidChange('settings.graphics.displayMode', handleDisplayModeChanged)
