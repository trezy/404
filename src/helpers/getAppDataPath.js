// Module imports
import { app } from 'electron'
import path from 'node:path'





/**
 * Builds an absolute path for the directory where the app should store all of its data.
 *
 * @returns {string} The app data directory path.
 */
export function getAppDataPath() {
	return path.join(app.getAppPath(), 'data')
}
