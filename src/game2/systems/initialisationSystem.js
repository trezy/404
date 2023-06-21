// Local imports
import { setRobotAnimation } from '../../newStore/helpers/setRobotAnimation.js'
import { setRobotPosition } from '../../newStore/helpers/setRobotPosition.js'
import { store } from '../../newStore/store.js'
import { TILE_SIZE } from '../../game/Tile.js'





/** Ensures everything required for the game to run has been initialised. */
export function initialisationSystem() {
	const {
		currentTileset,
		map,
		pixiApp,
		robotSprite,
		tilesetQueue,
		viewport,
	} = store.state

	if (!robotSprite) {
		const absoluteStartingPosition = {
			x: map.startingPosition.x * TILE_SIZE.width,
			y: map.startingPosition.y * TILE_SIZE.height,
		}

		setRobotAnimation('idle-east')
		setRobotPosition(absoluteStartingPosition)
	}

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
