// Local imports
import { GameSave } from './GameSave.js'





/**
 * The `SaveManager` allows creation and retrieval of save data.
 */
export class SaveManager {
	/****************************************************************************\
	 * Public static properties
	\****************************************************************************/

	/**
	 * @type {GameSave[]}
	 */
	static saves = []





	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#saveIsQueued = false





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Create a new `SaveManager.
	 */
	constructor() {
		const localSaves = JSON.parse(localStorage.getItem('debug-game:save-data') || 'false')

		if (localSaves) {
			SaveManager.saves = localSaves.map(save => {
				return new GameSave({ hydrationData: save })
			})
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Creates a new `GameSave`.
	 *
	 * @returns {GameSave} The newly created `GameSave`.
	 */
	createSave() {
		const save = new GameSave()

		SaveManager.saves.push(save)

		this.queueSave()

		return save
	}

	/**
	 * Retrieves all saves currently stored in the manager.
	 *
	 * @returns {GameSave[]} All available saves.
	 */
	getAllSaves() {
		return SaveManager.saves
	}

	/**
	 * Retrieves a single `GameSave` by its ID.
	 *
	 * @param {number} saveID The ID of the `GameSave` to be retrieved.
	 * @returns {GameSave} The retrieved `GameSave`.
	 */
	getSaveByID(saveID) {
		const save = SaveManager.saves.find(saveToCheck => {
			return saveToCheck.id === saveID
		})

		return save || null
	}

	/**
	 * Loads save data from disk.
	 */
	hydrate() {

	}

	/**
	 * Queue a save operation.
	 */
	queueSave() {
		if (this.#saveIsQueued) {
			return
		}

		this.#saveIsQueued = true

		queueMicrotask(() => {
			localStorage.setItem('debug-game:save-data', JSON.stringify(this))
			this.#saveIsQueued = false
		})
	}

	/**
	 * Compiles a JSON representation of all currently stored saves.
	 *
	 * @returns {Array} JSON representation of saves.
	 */
	toJSON() {
		return SaveManager.saves.map(save => save.serialize())
	}
}
