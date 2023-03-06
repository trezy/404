// Local imports
import { PLAY } from '../../constants/SceneNames.js'
import { replaceScene } from './replaceScene.js'
import { store } from '../store.js'
import { GameManager } from '../../game/GameManager.js'





/**
 * Loads the selected map.
 */
export const loadMap = async () => {
	const { mapID } = store.state

	const gameManager = new GameManager

	await gameManager.loadMap(mapID)

	store.set({ gameManager })

	replaceScene(PLAY)
}
