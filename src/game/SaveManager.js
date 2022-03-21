/**
 *
 */
class SaveLevelData {
	/**
	 *
	 * @param id
	 * @param time
	 * @param parent
	 */
	constructor(id, parent, time = -1) {
		this.parent = parent
		this._id = id
		this._time = time
	}

	/**
	 *
	 */
	get id() {
		return this._id
	}
	/**
	 *
	 */
	get time(){
		return this._time
	}

	/**
	 *
	 */
	set time(time){
		this._time = time
		this.parent._queueSave()
	}

	/**
	 *
	 */
	toJSON() {
		return {
			id: this._id,
			time: this._time,
		}
	}
}

/**
 *
 */
class LevelSaveList {
	/**
	 *
	 * @param levels
	 * @param parent
	 */
	constructor(levels,parent) {
		this.parent = parent
		this._levels = levels
	}

	/**
	 *
	 */
	get levels() {
		return this._levels
	}

	/**
	 *
	 */
	set levels(levels) {
		this.parent._queueSave()
		this._levels = levels
	}

	/**
	 *
	 * @param id
	 */
	get(id) {
		return this._levels.find(level => level.id === id)
	}

	/**
	 *
	 */
	toJSON() {
		return this._levels.map(level => level.toJSON())
	}
}

/**
 *
 */
class GameSave {
	/**
	 *
	 * @param id
	 * @param overrideData
	 * @param parent
	 */
	constructor(id, overrideData,parent) {
		this.saveManager = parent
		this._id = overrideData?.id || id
		this._levelData = new LevelSaveList(
			overrideData?.levelData
				? overrideData.levelData.map(({ saveID, time }) => {
					return new SaveLevelData(saveID, time,parent)
				})
				: [new SaveLevelData(0, parent, -1), new SaveLevelData(1, parent, -1), new SaveLevelData(2, parent, -1)]
		)
		this._name = overrideData?.name || 'Untitled Save'
		this._lastUpdateTime = overrideData?.lastUpdateTime || Date.now()
	}

	/**
	 *
	 */
	get id() {
		return this._id
	}

	/**
	 *
	 */
	get levelData() {
		return this._levelData
	}

	/**
	 *
	 */
	set levelData(value) {
		this._lastUpdateTime = Date.now()
		this._levelData = value
		this.parent._queueSave()
	}

	/**
	 *
	 */
	get name() {
		return this._name
	}

	/**
	 *
	 */
	set name(value) {
		this._lastUpdateTime = Date.now()
		this._name = value
		this.parent._queueSave()
	}

	/**
	 *
	 */
	toJSON() {
		return {
			id: this._id,
			levelData: this._levelData,
			name: this._name,
			lastUpdateTime: this._lastUpdateTime,
		}
	}
}
/**
 *
 */
class SaveManager {
	/**
	 *
	 * @param saves
	 */
	constructor(saves = []) {
		this.saves = saves.map(save => new GameSave(save.id, save,this))
		this._saveIsQueued = false
	}

	/**
	 *
	 */
	getAllSaves() {
		return this.saves
	}

	/**
	 *
	 * @param id
	 */
	getSave(id) {
		return this.saves.find(save => save.id === id) || null
	}

	/**
	 *
	 * @param id
	 */
	createSave(id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) {
		const save = new GameSave(id)
		this.saves.push(save)
		this._queueSave()
		return save
	}

	/**
	 *
	 * @param id
	 */
	getSaveByIdOrCreateNew(id) {
		const save = this.getSave(id)
		if (save) {
			return save
		}
		this._queueSave()
		return this.createSave(id)
	}

	/**
	 *
	 */
	toJSON() {
		return this.saves.map(save => save.toJSON())
	}

	/**
	 *
	 */
	_queueSave() {
		if (this._saveIsQueued) {
			return
		}
		this._saveIsQueued = true
		queueMicrotask(() => {
			localStorage.setItem('debug-game:save-data', JSON.stringify(this))
			this._saveIsQueued = false
		})
	}










}
/**
 * @type {SaveManager}
 */
let saveManager
if (localStorage.getItem('debug-game:save-data')) {
	const saveData = JSON.parse(localStorage.getItem('debug-game:save-data'))
	saveManager = new SaveManager(saveData)
} else {
	saveManager = new SaveManager()
}
globalThis.debugSaveManager = saveManager
export default saveManager
