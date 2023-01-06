// Module imports
import {
	readFile,
	watch,
} from 'node:fs/promises'
import path from 'node:path'





// Local imports
import { getAppDataPath } from './getAppDataPath.js'
import { getArchiveMeta } from './getArchiveMeta.js'
import { mainWindow } from '../helpers/createWindow.js'
import { STATE } from './state.js'





/**
 * Starts a watcher the reports changes to local content.
 */
export async function handleInitialiseContentWatcher() {
	STATE.contentWatcherAbortController = new AbortController

	const { signal } = STATE.contentWatcherAbortController
	const contentPath = getAppDataPath()

	try {
		const watcher = watch(contentPath, {
			recursive: true,
			signal,
		})

		for await (const event of watcher) {
			const archivePath = path.join(contentPath, event.filename)

			if (event.eventType === 'change') {
				const archiveMeta = await getArchiveMeta(archivePath)

				STATE.metaCache[archivePath] = archiveMeta

				mainWindow.webContents.send('contentChanged', archiveMeta)
			} else if (event.eventType === 'rename') {
				try {
					await readFile(archivePath)
				} catch (error) {
					mainWindow.webContents.send('contentRemoved', STATE.metaCache[archivePath])
					delete STATE.metaCache[archivePath]
				}
			}
		}
	} catch (error) {
		if (error.name === 'AbortError') {
			return
		}

		throw error
	}
}
