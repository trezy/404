// Module imports
import { ipcRenderer } from 'electron'





/**
 * Controls loading and unloading of maps and assets.
 */
export class ContentManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#isContentWatcherInitialised = false

	#manifests = {
		maps: {},
		resourcepacks: {},
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Create a new content manager.
	 */
	constructor() {
		ipcRenderer.on('contentAdded', (...args) => this.#handleContentAddedOrChanged(...args))
		ipcRenderer.on('contentChanged', (...args) => this.#handleContentAddedOrChanged(...args))
		ipcRenderer.on('contentRemoved', (...args) => this.#handleContentRemoved(...args))
		this.initialiseContentWatcher()
	}





	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/**
	 * Fired any time a file is added or changed in the content directories.
	 *
	 * @param {object} event The event object.
	 * @param {object} contentMeta Metadata for the content.
	 */
	#handleContentAddedOrChanged(event, contentMeta) {
		this.#manifests[contentMeta.type][contentMeta.id] = {
			...contentMeta,
			isLoaded: false,
		}
	}

	/**
	 * Fired any time changes a file is deleted in the content directories.
	 *
	 * @param {object} event The event object.
	 * @param {object} contentMeta Metadata for the content.
	 */
	#handleContentRemoved(event, contentMeta) {
		delete this.#manifests[contentMeta.type][contentMeta.id]
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Initialises the content watcher.
	 */
	initialiseContentWatcher() {
		if (!this.#isContentWatcherInitialised) {
			ipcRenderer.invoke('initialiseContentWatcher')
			this.#isContentWatcherInitialised = true
		}
	}

	/**
	 * Loads data for a map.
	 *
	 * @param {string} mapID The ID of the map to be loaded.
	 */
	loadMap(mapID) {}

	/**
	 * Loads metadata for all currently available content.
	 */
	async loadMeta() {
		this.#manifests = await ipcRenderer.invoke('getContentMeta')
	}

	/**
	 * Loads data for a resourcepack.
	 *
	 * @param {string} resourcepackID The ID of the resourcepack to be loaded.
	 */
	loadResourcepack(resourcepackID) {}

	/**
	 * Removes a map's data from the ContentManager.
	 *
	 * @param {string} mapID The ID of the map to be unloaded.
	 */
	unloadMap(mapID) {}

	/**
	 * Removes a resourcepack's data from the ContentManager.
	 *
	 * @param {string} resourcepackID The ID of the resourcepack to be unloaded.
	 */
	unloadResourcepack(resourcepackID) {}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {object} A hash of all available resourcepacks.
	 */
	get resourcepacks() {
		return this.#manifests.resourcepacks
	}
}
