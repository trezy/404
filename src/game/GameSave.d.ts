/**
 * Represent A level in the GameSave
 */
export interface LevelData {
  /**
   * unique id of the level
   * this value should be unqiue within the GameSave's levelData array
   * @type {number}
   */
  id: number;
  /**
   * time spent in the level in milliseconds, -1 if the level has not been played
   */
  time: number;
}

/**
 * Represents a GameSave, this is the required data to track a users progress
 */
export interface GameSave {
  /**
   * id of the save file
   */
  id: number;
  /**
   * name of the game save, this value should be user configurable
   * @type {string}
   */
  name: string;
  /**
   * list of levels stored in the save
   * @type {LevelData[]}
   */
  levelData: LevelData[];
  /**
   * last time the save was written to, this value should be updated every time the save is written to or updated.
   * can be used to order saves from newest to oldest
   * @type {number}
   */
  lastUpdatedTime: DOMHighResTimeStamp;
}
