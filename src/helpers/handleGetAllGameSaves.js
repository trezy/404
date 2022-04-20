// Module imports
import { log } from 'electron-log'





// Local imports
import { GameSave } from 'game/structures/GameSave.js'





export async function handleGetAllGameSaves() {
	let gameSaves = []
	let gameSavesSerialized = []

	log(`🗓 Handling \`getAllGameSaves\`...`)

	try {
		gameSaves = await GameSave.getAllSaves()
		gameSavesSerialized = gameSaves.map(gameSave => gameSave.serialize())
	} catch(error) {
		console.log(error)
	}

	log(`✅ Finished handling \`getAllGameSaves\`; returning ${gameSaves.length} save${(gameSaves.length !== 1) ? 's' : ''}`)

	return gameSavesSerialized
}
