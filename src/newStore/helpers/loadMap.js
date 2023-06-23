// Module imports
import { Graphics } from 'pixi.js'
import { Viewport } from 'pixi-viewport'




// Local imports
import { PLAY } from '../../constants/SceneNames.js'
import { replaceScene } from './replaceScene.js'
import { RobotManager } from '../../game2/structures/RobotManager.js'
import { store } from '../store.js'
import { TILE_SIZE } from '../../game/Tile.js'
import { TileMapManager } from '../../game2/structures/TileMapManager.js'





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

	const mapData = await contentManager.loadMap(mapID)

	const map = new TileMapManager({ mapData })
	const tilesetQueue = mapData.queue.map(tilesetData => new TileMapManager({
		alpha: 0.5,
		mapData: tilesetData,
	}))

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
	viewport.addChildAt(map.sprite, 1)

	const robot = new RobotManager({ position: map.startingPosition })

	store.set(() => ({
		map,
		robot,
		tilesetQueue,
		timerGracePeriod: 10000,
	}))

	replaceScene(PLAY)
}
