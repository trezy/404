// Module imports
import { log } from 'electron-log'





// Local imports
import { GameSave } from 'game/structures/GameSave.js'
import { getDatabase } from 'helpers/getDatabase.js'





export async function handleLoadGame(gameID) {
	let gameSave = null

	if (gameID) {
		gameSave = await GameSave.getSave(gameID)
	} else {
		gameSave = await GameSave.createNewSave()
	}

	const databaseClient = await getDatabase(gameSave)

	// return gameSave.serialize()
}
