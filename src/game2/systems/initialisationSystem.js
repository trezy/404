// Local imports
import { store } from '../../newStore/store.js'





/** Ensures everything required for the game to run has been initialised. */
export function initialisationSystem() {
	const {
		currentTileset,
		pixiApp,
		tilesetQueue,
		viewport,
	} = store.state

	if (!currentTileset && tilesetQueue.length) {
		store.set(previousState => {
			const [currentTileset, ...tilesetQueue] = previousState.tilesetQueue

			viewport.addChildAt(currentTileset.sprite, 3)

			return {
				currentTileset,
				tilesetQueue,
			}
		})
	}

	if (!pixiApp.ticker.started) {
		pixiApp.start()
	}
}
