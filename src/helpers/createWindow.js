// Module imports
import { BrowserWindow } from 'electron'





export function createWindow() {
	// new ConfigStore(configSchema)
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		height: 600,
		nodeIntegration: false,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
		},
		width: 800,
	})

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

	// Open the DevTools.
	mainWindow.webContents.openDevTools()
}
