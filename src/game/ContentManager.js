// Module imports
import { ipcRenderer } from 'electron'





// Local imports
import { EventEmitter } from './EventEmitter.js'





/**
 * Controls loading and unloading of maps and assets.
 */
export class ContentManager extends EventEmitter {
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
		super()
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
			isLoading: false,
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
	 * Returns the data for a resourcepack.
	 *
	 * @param {string} resourcepackID The ID of the resourcepack to be retrieved.
	 * @returns {object} The resourcepack's data/
	 */
	getResourcepack(resourcepackID) {
		const { resourcepacks } = this.#manifests

		if (!resourcepacks[resourcepackID]) {
			throw new Error(`Resourcepack with ID ${resourcepackID} doesn't exist.`)
		}

		return resourcepacks[resourcepackID]
	}

	/**
	 * Retrieves a tile by ID.
	 *
	 * @param {string} tileID The ID of the tile to be retrieved.
	 * @param {string} resourcepackID The ID of the resourcepack to which the tile belongs.
	 * @returns {object} The requested tile.
	 */
	getTile(tileID, resourcepackID) {
		return this.#manifests.resourcepacks[resourcepackID].tiles[tileID]
	}

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
	async loadResourcepack(resourcepackID) {
		const { resourcepacks } = this.#manifests

		if (!resourcepacks[resourcepackID]) {
			throw new Error(`Resourcepack with ID ${resourcepackID} doesn't exist.`)
		}

		this.emit('resourcepack:loading', resourcepackID)

		resourcepacks[resourcepackID].isLoading = true

		const tiles = await ipcRenderer.invoke('loadResourcepack', resourcepackID)

		for await (const tile of Object.values(tiles)) {
			tile.image = new Image
			tile.image.src = tile.dataURI
			await tile.image.decode()
		}

		resourcepacks[resourcepackID].isLoaded = false
		resourcepacks[resourcepackID].isLoading = false
		resourcepacks[resourcepackID].tiles = tiles

		this.emit('resourcepack:loaded', resourcepackID)

		return resourcepacks[resourcepackID]
	}

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
	unloadResourcepack(resourcepackID) {
		const resourcepack = this.#manifests.resourcepacks[resourcepackID]

		resourcepack.isLoaded = false
		resourcepack.isLoading = false
		delete resourcepack.tiles

		this.emit('resourcepack:unloaded', resourcepackID)
	}





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
