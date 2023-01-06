// Module imports
import path from 'node:path'





// Local imports
import { findOrCreateDirectory } from './findOrCreateDirectory.js'
import { getAppDataPath } from './getAppDataPath.js'





// Constants
const appDataDirectories = [
	'maps',
	'resourcepacks',
]





/**
 * Creates all necessary directories on the local machine.
 */
export async function handleInitialiseDirectories() {
	const appDirectory = getAppDataPath()
	const promises = []
	let appDataDirectoriesIndex = 0

	while (appDataDirectoriesIndex < appDataDirectories.length) {
		const directoryPath = path.join(appDirectory, appDataDirectories[appDataDirectoriesIndex])

		promises.push(findOrCreateDirectory(directoryPath))

		appDataDirectoriesIndex += 1
	}

	await Promise.all(promises)
}
