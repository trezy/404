/* eslint-env node */
/* global MAIN_WINDOW_WEBPACK_ENTRY */

// Module imports
import {
	BrowserWindow,
	screen,
} from 'electron'





// Local imports
import { configStore } from './configStore.js'





// Variables
export let mainWindow = null





/**
 * Creates a new window.
 */
export function createWindow() {
	let display = null
	const preferredDisplay = configStore.get('settings.graphics.preferredDisplay')

	// Get the resolution of the current screen.
	if (preferredDisplay === 'primary') {
		display = screen.getPrimaryDisplay()
	}

	console.log(display.workArea)

	// Create the browser window.
	mainWindow = new BrowserWindow({
		autoHideMenuBar: true,
		backgroundColor: '#140c1c',
		fullscreen: configStore.get('settings.graphics.displayMode') === 'fullscreen',
		height: display.workArea.height,
		show: false,
		title: 'Debug',
		webPreferences: {
			backgroundThrottling: false,
			contextIsolation: false,
			nodeIntegration: true,
		},
		width: display.workArea.width,
		x: display.workArea.x,
		y: display.workArea.y,
	})

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

	mainWindow.once('ready-to-show', () => mainWindow.show())

	mainWindow.on('leave-full-screen', () => {
		configStore.set('settings.graphics.displayMode', 'windowed')
	})

	mainWindow.on('enter-full-screen', () => {
		configStore.set('settings.graphics.displayMode', 'fullscreen')
	})
}
