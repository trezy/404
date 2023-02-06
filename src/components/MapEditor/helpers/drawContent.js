// Local imports
import {
	getTarget,
	store,
} from '../store.js'
import { TILE_SIZE } from '../../../game/Tile.js'





export function drawContent(canvasElement) {
	const {
		contentManager,
		isDestinationsVisible,
		isStartingPositionVisible,
		tool,
	} = store.state

	const context = canvasElement.getContext('2d')

	const target = getTarget(store.state)

	if (!target) {
		return
	}

	target.layers.forEach(layer => {
		Object.entries(layer).forEach(([coordinateString, tileData]) => {
			const [cellX, cellY] = coordinateString
				.split('|')
				.map(Number)
			const tile = contentManager.getTile(tileData.tileID, tileData.resourcepackID)

			context.drawImage(
				tile.image,
				0,
				0,
				TILE_SIZE.width * 3,
				TILE_SIZE.height * 3,
				(cellX * TILE_SIZE.width),
				(cellY * TILE_SIZE.height),
				TILE_SIZE.width,
				TILE_SIZE.height,
			)
		})
	})

	if (target.destinations && (isDestinationsVisible || (tool === 'destination'))) {
		target.destinations.forEach(destination => {
			context.globalAlpha = 0.5
			context.strokeStyle = 'black'
			context.lineWidth = 4

			context.strokeRect(
				destination.x * TILE_SIZE.width,
				destination.y * TILE_SIZE.height,
				TILE_SIZE.width,
				TILE_SIZE.height,
			)

			context.globalAlpha = 1
			context.strokeStyle = '#346524'
			context.lineWidth = 2

			context.strokeRect(
				destination.x * TILE_SIZE.width,
				destination.y * TILE_SIZE.height,
				TILE_SIZE.width,
				TILE_SIZE.height,
			)
		})
	}

	if (target.startingPosition && (isStartingPositionVisible || (tool === 'starting position'))) {
		context.globalAlpha = 0.5
		context.strokeStyle = 'black'
		context.lineWidth = 4

		context.strokeRect(
			target.startingPosition.x * TILE_SIZE.width,
			target.startingPosition.y * TILE_SIZE.height,
			TILE_SIZE.width,
			TILE_SIZE.height,
		)

		context.globalAlpha = 1
		context.strokeStyle = '#597dce'
		context.lineWidth = 2

		context.strokeRect(
			target.startingPosition.x * TILE_SIZE.width,
			target.startingPosition.y * TILE_SIZE.height,
			TILE_SIZE.width,
			TILE_SIZE.height,
		)
	}
}
