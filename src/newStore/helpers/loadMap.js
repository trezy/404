// Module imports
import { CompositeTilemap } from '@pixi/tilemap'
import { Graphics } from 'pixi.js'
import { Viewport } from 'pixi-viewport'




// Local imports
import { MapManager } from '../../game/MapManager.js'
import { PLAY } from '../../constants/SceneNames.js'
import { renderMapToTilemap } from '../../helpers/renderMapToTilemap.js'
import { replaceScene } from './replaceScene.js'
import { store } from '../store.js'
import { TILE_SIZE } from '../../game/Tile.js'





/**
 * Loads the selected map.
 */
export const loadMap = async () => {
	const {
		contentManager,
		mapID,
		pixiApp,
		viewport,
	} = store.state

	const map = await contentManager.loadMap(mapID)

	const mapManager = new MapManager({ map })
	store.set({ mapManager })

	const gridManager = new Graphics

	gridManager.name = 'grid'

	const gridColor = getComputedStyle(document.body)
		.getPropertyValue('--palette-purple-hex')

	// Fill the screen with the grid color
	gridManager.beginFill(gridColor, 0.1)
	gridManager.drawRect(
		0,
		0,
		pixiApp.screen.width,
		pixiApp.screen.height,
	)
	gridManager.endFill()

	// Cut out the grid
	gridManager.beginHole()

	const renderHeight = Math.ceil(pixiApp.screen.height / TILE_SIZE.height) + 2
	const renderWidth = Math.ceil(pixiApp.screen.width / TILE_SIZE.width) + 2

	let column = 0
	let row = 0

	while (row <= renderHeight) {
		while (column <= renderWidth) {
			gridManager.drawRect(
				(column * TILE_SIZE.width) + 1,
				(row * TILE_SIZE.height) + 1,
				TILE_SIZE.width - 1,
				TILE_SIZE.height - 1,
			)
			column += 1
		}

		column = 0
		row += 1
	}

	gridManager.endHole()

	viewport.addChildAt(gridManager, 0)

	const mainMapContainer = renderMapToTilemap(mapManager, { name: 'map' })

	viewport.addChildAt(mainMapContainer, 1)

	replaceScene(PLAY)
}
