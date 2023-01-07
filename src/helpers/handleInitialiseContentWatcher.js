// Module imports
import chokidar from 'chokidar'





// Local imports
import { getAllContentManifests } from './getAllContentManifests.js'
import { getAppDataPath } from './getAppDataPath.js'
import { getArchiveMeta } from './getArchiveMeta.js'
import { mainWindow } from '../helpers/createWindow.js'
import { STATE } from './state.js'





/**
 * Starts a watcher the reports changes to local content.
 */
export async function handleInitialiseContentWatcher() {
	const contentPath = getAppDataPath()
	const contentManifestHash = await getAllContentManifests()

	Object
		.values(contentManifestHash)
		.map(manifest => Object.values(manifest))
		.flat()
		.forEach(archiveMeta => {
			mainWindow.webContents.send('contentAdded', archiveMeta)
		})

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	STATE.contentWatcher = chokidar.watch(contentPath, {
		awaitWriteFinish: true,
		ignored: /(?<!\.debug(resourcepack|map))$/u,
		ignoreInitial: false,
	})

	// eslint-disable-next-line jsdoc/require-jsdoc
	const handleContentChanged = async archivePath => {
		const archiveMeta = await getArchiveMeta(archivePath)

		STATE.metaCache[archivePath] = archiveMeta

		mainWindow.webContents.send('contentChanged', archiveMeta)
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	const handleContentRemoved = archivePath => {
		mainWindow.webContents.send('contentRemoved', STATE.metaCache[archivePath])
		delete STATE.metaCache[archivePath]
	}

	STATE.contentWatcher
		.on('add', handleContentChanged)
		.on('change', handleContentChanged)
		.on('unlink', handleContentRemoved)
}
