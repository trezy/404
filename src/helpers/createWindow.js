/* eslint-env node */
/* global MAIN_WINDOW_WEBPACK_ENTRY */

// Module imports
import { BrowserWindow } from 'electron'





/**
 * Creates a new window.
 */
export function createWindow() {
	// new ConfigStore(configSchema)
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		autoHideMenuBar: true,
		backgroundColor: '#140c1c',
		frame: false,
		height: 600,
		show: false,
		title: 'Debug',
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
		},
		width: 800,
	})

	// and load the index.html of the app.
	// @ts-ignore
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

	// Open the DevTools.
	mainWindow.webContents.openDevTools()

	mainWindow.once('ready-to-show', () => mainWindow.show())
}
