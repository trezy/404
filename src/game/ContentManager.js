// Module imports
import { ipcRenderer } from 'electron'





/**
 * Controls loading and unloading of maps and assets.
 */
export class ContentManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#manifests = {
		maps: [],
		tilesets: [],
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Create a new content manager.
	 */
	constructor() {
		ipcRenderer.on('contentChanged', this.#handleContentChanged)
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Fired any time changes occur in the content directories.
	 *
	 * @param {object} event The event object.
	 * @param {object} contentMeta Metadata for the content.
	 */
	#handleContentChanged(event, contentMeta) {
		console.log(event, contentMeta)
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

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
		ipcRenderer.invoke('initialiseContentWatcher')
	}

	/**
	 * Loads data for a tileset.
	 *
	 * @param {string} tilesetID The ID of the tileset to be loaded.
	 */
	loadTileset(tilesetID) {}

	/**
	 * Removes a map's data from the ContentManager.
	 *
	 * @param {string} mapID The ID of the map to be unloaded.
	 */
	unloadMap(mapID) {}

	/**
	 * Removes a tileset's data from the ContentManager.
	 *
	 * @param {string} tilesetID The ID of the tileset to be unloaded.
	 */
	unloadTileset(tilesetID) {}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {object} A hash of all maps that are currently available.
	 */
	get maps() {
		return this.#manifests.maps
	}

	/**
	 * @returns {object} A hash of all tilesets that are currently available.
	 */
	get tilesets() {
		return this.#manifests.tilesets
	}
}
