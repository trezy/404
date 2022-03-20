class SaveLevelData {
	constructor(id, time = -1,parent) {
		this.parent = parent;
		this._id = id;
		this._time = time;
	}
	get id() {
		return this._id;
	}
	set time(time){
		this._time = time;
		this.parent._queueSave();
	}
	get time(){
		return this._time;
	}
	toJSON() {
		return {
			id: this._id,
			time: this._time,
		};
	}
}
class LevelSaveList {
	constructor(levels,parent) {
		this.parent = parent;
		this._levels = levels;
	}
	set levels(levels) {
		this.parent._queueSave();
		this._levels = levels;
	}
	get levels() {
		return this._levels;
	}
	get(id) {
		return this._levels.find((level) => level.id === id);
	}
	toJSON() {
		return this._levels.map((level) => level.toJSON());
	}
}
class GameSave {
	constructor(id, overrideData,parent) {
		this.saveManager = parent;
		this._id = overrideData?.id || id;
		this._levelData = new LevelSaveList(
			overrideData?.levelData
				? overrideData.levelData.map(({ id, time }) => {
						return new SaveLevelData(id, time,parent);
				  })
				: [new SaveLevelData(0,-1,parent), new SaveLevelData(1,-1,parent), new SaveLevelData(2,-1,parent)]
		);
		this._name = overrideData?.name || "Untitled Save";
		this._lastUpdateTime = overrideData?.lastUpdateTime || Date.now();
	}
	get id() {
		return this._id;
	}
	get levelData() {
		return this._levelData;
	}
	get name() {
		return this._name;
	}
	set name(value) {
		this._lastUpdateTime = Date.now();
		this._name = value;
		this.parent._queueSave();
	}
	set levelData(value) {
		this._lastUpdateTime = Date.now();
		this._levelData = value;
		this.parent._queueSave();
	}
	toJSON() {
		return {
			id: this._id,
			levelData: this._levelData,
			name: this._name,
			lastUpdateTime: this._lastUpdateTime,
		};
	}
}
class SaveManager {
	constructor(saves = []) {
		this.saves = saves.map((save) => new GameSave(save.id, save,this));
		this._saveIsQueued = false;
	}
	_queueSave() {
		if (this._saveIsQueued) {
			return;
		}
		this._saveIsQueued = true;
		queueMicrotask(() => {
			localStorage.setItem("debug-game:save-data", JSON.stringify(this));
			this._saveIsQueued = false;
		});
	}
	getAllSaves() {
		return this.saves;
	}
	getSave(id) {
		return this.saves.find((save) => save.id === id) || null;
	}
	createSave(id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) {
		const save = new GameSave(id);
		this.saves.push(save);
		this._queueSave();
		return save;
	}
	getSaveByIdOrCreateNew(id) {
		const save = this.getSave(id);
		if (save) {
			return save;
		}
		this._queueSave();
		return this.createSave(id);
	}
	toJSON() {
		return this.saves.map((save) => save.toJSON());
	}
}
/**
 * @type {SaveManager}
 */
let saveManager;
if (localStorage.getItem("debug-game:save-data")) {
	const saveData = JSON.parse(localStorage.getItem("debug-game:save-data"));
	saveManager = new SaveManager(saveData);
} else {
	saveManager = new SaveManager();
}
globalThis.debugSaveManager = saveManager;
export default saveManager;
