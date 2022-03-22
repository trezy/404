// Local imports
import { GameSave } from './GameSave.js'
import { MapSaveData } from './MapSaveData.js'
import { SaveManager } from './SaveManager.js'
import { store } from '../store/index.js'





/**
 * Wrapper for an array of
 */
export class MapSaveDataList {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#mapSaves = null





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Create a new list of map save data.
	 *
	 * @param {object} config Configuration for the new save data.
	 * @param {number} config.gameSaveID ID of the game save to which these map saves belong.
	 * @param {Array} config.mapSaves Level data with which to hydrate this list.
	 */
	constructor(config) {
		const { mapSaves } = config

		this.config = config

		this.#mapSaves = mapSaves.map(serializedMapSave => {
			return new MapSaveData(serializedMapSave)
		})
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Retrieve map save data by map ID.
	 *
	 * @param {number} mapID The ID of the map for which save data will be retrieved.
	 * @returns {MapSaveData} Save data for the requested map.
	 */
	getMapSaveByMapID(mapID) {
		return this.mapSaves.find(mapSave => (mapSave.mapID === mapID))
	}

	/**
	 * Calculates the the cumulative time spent playing the maps in this list.
	 *
	 * @returns {number} The number of milliseconds that have been spent playing these maps.
	 */
	getTimePlayed() {
		return this.mapSaves.reduce((total, mapSave) => {
			return total += Math.max(mapSave.timePlayed, 0)
		}, 0)
	}

	/**
	 * Serializes all map save data.
	 *
	 * @returns {Array} A plain array containing all of the map saves as plain objects.
	 */
	serialize() {
		return this.#mapSaves.map(mapSave => mapSave.serialize())
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {GameSave} The game save this list belongs to.
	 */
	get gameSave() {
		return this.saveManager.getSaveByID(this.gameSaveID)
	}

	/**
	 * @returns {number} The ID of the game save this list belongs to.
	 */
	get gameSaveID() {
		return this.config.gameSaveID
	}

	/**
	 * @returns {MapSaveData[]} All map save data.
	 */
	get mapSaves() {
		return this.#mapSaves
	}

	/**
	 * @returns {SaveManager} The global save manager.
	 */
	get saveManager() {
		const { saveManager } = store.getState()
		return saveManager
	}
}
