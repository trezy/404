/**
 * Stores save data for an individual map. Used in conjunction with `GameSave`.
 */
export class MapSaveData {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#bestTime = null

	#timePlayed = null





	/****************************************************************************\
	 * Public instance properties
	\****************************************************************************/

	config = null





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Create a new instance of save data for a map.
	 *
	 * @param {object} config Configuration for the new save data.
	 * @param {number} config.mapID The ID of the map with which this save data is associated.
	 * @param {number} [config.bestTime] The current best time (in milliseconds) for this map in this save.
	 * @param {number} [config.timePlayed] The total time (in milliseconds) spent playing on this map.
	 */
	constructor(config) {
		this.config = config
		this.hydrate()
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 *
	 */
	hydrate() {
		this.#bestTime = this.config.bestTime
		this.#timePlayed = this.config.timePlayed
	}

	/**
	 * Serializes map save data.
	 *
	 * @returns {object} This map save data as a plain object.
	 */
	serialize() {
		return {
			bestTime: this.bestTime,
			mapID: this.mapID,
			timePlayed: this.timePlayed,
		}
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {number} The ID of the map with which this save data is associated.
	 */
	get mapID() {
		return this.config.mapID
	}

	/**
	 * @returns {number} The best completion time that's been recorded for this map.
	 */
	get bestTime() {
		return this.#bestTime || -1
	}

	/**
	 * @returns {number} The number of milliseconds that have been spent playing this map.
	 */
	get timePlayed() {
		return this.#timePlayed || -1
	}
}
