/* eslint-env node */

// Module imports
import { screen } from 'electron'
import sysinfo from 'systeminformation'





/**
 * Retrieves information about displays on this system and returns it to the renderer.
 */
export async function handleGetDisplaysInformation() {
	console.log(screen.getAllDisplays())

	const displays = screen.getAllDisplays()
	const siGraphics = await sysinfo.graphics()

	console.log(siGraphics)

	return displays

	// return displays.map(display => {
	// 	return {
	// 		currentRefreshRate: display.currentRefreshRate,
	// 		currentResX: display.currentResX,
	// 		currentResY: display.currentResY,
	// 		positionX: display.positionX,
	// 		positionY: display.positionY,
	// 		resolutionX: display.resolutionX,
	// 		resolutionY: display.resolutionY,
	// 	}
	// })
}
