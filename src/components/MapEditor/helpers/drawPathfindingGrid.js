// Local imports
import { store } from '../store.js'
import { TILE_SIZE } from '../../../game/Tile.js'





export function drawPathfindingGrid(canvasElement) {
	const {
		activeTabID,
		isPathfindingGridVisible,
		maps,
	} = store.state

	if (!isPathfindingGridVisible) {
		return
	}

	const context = canvasElement.getContext('2d')

	const map = maps[activeTabID]

	context.globalAlpha = 0.5

	Object
		.entries(map.pfgrid)
		.forEach(([coordinateString, tileState]) => {
			const [cellX, cellY] = coordinateString
				.split('|')
				.map(Number)

			if (tileState.isBlocking) {
				context.fillStyle = 'red'
			} else if (tileState.isTraversable) {
				context.fillStyle = 'purple'
			}

			context.fillRect(
				cellX * TILE_SIZE.width,
				cellY * TILE_SIZE.height,
				TILE_SIZE.width,
				TILE_SIZE.height,
			)
		})

	context.globalAlpha = 1
}
