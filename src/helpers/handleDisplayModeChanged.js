// Local imports
import { mainWindow } from './createWindow.js'





/**
 * Handles updating the display mode when the setting is changed.
 *
 * @param {'fullscreen' | 'windowed' | 'fullscreen extended window'} value The new value of the display mode setting.
 */
export function handleDisplayModeChanged(value) {
	if ((value === 'fullscreen') && !mainWindow.isFullScreen()) {
		mainWindow.setFullScreen(true)
	} else if ((value !== 'fullscreen') && mainWindow.isFullScreen()) {
		mainWindow.setFullScreen(false)
	}
}
