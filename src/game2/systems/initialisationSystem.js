// Module imports
import { AlphaFilter } from 'pixi.js'





// Local imports
import { renderMapToTilemap } from '../../helpers/renderMapToTilemap.js'
import { setRobotAnimation } from '../../newStore/helpers/setRobotAnimation.js'
import { setRobotPosition } from '../../newStore/helpers/setRobotPosition.js'
import { store } from '../../newStore/store.js'
import { TILE_SIZE } from '../../game/Tile.js'





/** Ensures everything required for the game to run has been initialised. */
export function initialisationSystem() {
	const {
		mapManager,
		pixiApp,
		robotSprite,
		viewport,
	} = store.state

	if (!robotSprite) {
		const absoluteStartingPosition = {
			x: mapManager.startingPosition.x * TILE_SIZE.width,
			y: mapManager.startingPosition.y * TILE_SIZE.height,
		}

		setRobotAnimation('idle-east')
		setRobotPosition(absoluteStartingPosition)
	}

	if (!viewport.getChildByName('tileset') && mapManager.tileset) {
		const tilesetContainer = renderMapToTilemap(mapManager.tileset, {
			alpha: 0.5,
			name: 'tileset',
		})

		tilesetContainer.children.forEach(child => {
			const alphaFilter = child.filters.find(filter => filter instanceof AlphaFilter)
			alphaFilter.alphaFilter = 0.5
		})

		viewport.addChildAt(tilesetContainer, 3)
	}

	if (!pixiApp.ticker.started) {
		pixiApp.start()
	}
}
