// Local imports
import { MapSaveDataList } from './MapSaveDataList.js'
import { store } from '../store/index.js'





/**
 * A save which contains data for game state.
 */
export class GameSave {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

	#mapSaves = null

	#name = 'Untitled Save'

	#updatedAt = Date.now()





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Create a new game save.
	 *
	 * @param {object} [config] Configuration for the new save data.
	 * @param {object} [config.hydrationData] Save data loaded from disk.
	 */
	constructor(config = {}) {
		const { hydrationData } = config

		this.config = config

		this.hydrate(hydrationData)
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Calculates the total amount of time played in this save
	 *
	 * @returns {number} The number of milliseconda that have been spent playing this save.
	 */
	getTimePlayed() {
		return this.mapSaves?.getTimePlayed() || 0
	}

	/**
	 * Hydrates this save with save data from disk.
	 *
	 * @param {object} hydrationData Save data from disk.
	 * @param {number} [hydrationData.id] The ID of the stored save.
	 * @param {Array} [hydrationData.mapSaves] Map save data.
	 * @param {string} [hydrationData.name] The name of the stored save.
	 * @param {number} [hydrationData.updatedAt] A timestamp (in milliseconds) of the last time this save was updated.
	 */
	hydrate(hydrationData) {
		if (hydrationData) {
			if (hydrationData.id) {
				this.#id = hydrationData.id
			}

			if (hydrationData.name) {
				this.#name = hydrationData.name
			}

			if (hydrationData.updatedAt) {
				this.#updatedAt = hydrationData.updatedAt
			}

			if (hydrationData.mapSaves) {
				this.#mapSaves = new MapSaveDataList({
					gameSaveID: this.id,
					mapSaves: hydrationData.mapSaves,
				})
			}
		}
	}

	/**
	 * Compiles a JSON representation of this save.
	 *
	 * @returns {object} JSON representation of this save.
	 */
	serialize() {
		return {
			id: this.id,
			mapSaves: this.mapSaves,
			name: this.name,
			updatedAt: this.updatedAt,
		}
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * Retrieves the save's ID.
	 *
	 * @returns {number} The save's ID.
	 */
	get id() {
		return this.#id
	}

	/**
	 * A list of all level save data included in this save.
	 *
	 * @returns {MapSaveDataList} All level save data.
	 */
	get mapSaves() {
		return this.#mapSaves
	}

	/**
	 * Name of the game save. This value should be user configurable.
	 *
	 * @returns {string} The name of the save.
	 */
	get name() {
		return this.#name
	}

	/**
	 * Updates thename of this save. Queues a save operation.
	 */
	set name(value) {
		const { saveManager } = store.getState()

		this.#updatedAt = Date.now()
		this.#name = value

		saveManager.queueSave()
	}

	/**
	 * The last time that the save was written to. This value must be updated every time the save is updated. Can be used to order saves from newest to oldest
	 *
	 * @returns {number} Timestamp (in milliseconds) of the last time this save as updated.
	 */
	get updatedAt() {
		return this.#updatedAt
	}
}
