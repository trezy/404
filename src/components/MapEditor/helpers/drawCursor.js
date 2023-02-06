// Local imports
import { resetTransform } from './resetTransform.js'
import { store } from '../store.js'
import { TILE_SIZE } from '../../../game/Tile.js'





export function drawCursor(canvasElement) {
	const context = canvasElement.getContext('2d')
	const {
		activeTileBrush,
		contentManager,
		cursorX,
		cursorY,
		renderOffset,
		resolution,
		tool,
		uiScale,
	} = store.state

	if (!cursorX || !cursorY) {
		return
	}

	const pixelSize = resolution * uiScale

	const pixelX = Math.floor(cursorX * (resolution / uiScale))
	const pixelY = Math.floor(cursorY * (resolution / uiScale))

	const cellX = Math.floor((pixelX - renderOffset.x) / TILE_SIZE.width) * TILE_SIZE.width
	const cellY = Math.floor((pixelY - renderOffset.y) / TILE_SIZE.height) * TILE_SIZE.height

	const rootElement = document.querySelector(':root')
	const rootElementStyles = getComputedStyle(rootElement)

	const blueHex = rootElementStyles.getPropertyValue('--palette-blue')
	const greenHex = rootElementStyles.getPropertyValue('--palette-green')
	const redHex = rootElementStyles.getPropertyValue('--palette-red')

	context.setTransform(
		pixelSize,
		0,
		0,
		pixelSize,
		0,
		0,
	)

	context.fillStyle = 'white'
	context.fillRect(
		pixelX,
		pixelY,
		1,
		1,
	)

	resetTransform(canvasElement)

	switch (tool) {
		case 'brush': {
			if (activeTileBrush) {
				const tile = contentManager.getTile(activeTileBrush.tileID, activeTileBrush.resourcepackID)
				context.globalAlpha = 0.6
				context.drawImage(
					tile.image,
					0,
					0,
					TILE_SIZE.width * 3,
					TILE_SIZE.height * 3,
					cellX,
					cellY,
					TILE_SIZE.width,
					TILE_SIZE.height,
				)
			}
			break
		}

		case 'destination':
			context.globalAlpha = 0.6
			context.strokeStyle = greenHex
			context.lineWidth = 2
			context.strokeRect(
				cellX,
				cellY,
				TILE_SIZE.width,
				TILE_SIZE.height,
			)
			break

		case 'eraser':
			context.globalAlpha = 0.6
			context.strokeStyle = redHex
			context.lineWidth = 2
			context.strokeRect(
				cellX,
				cellY,
				TILE_SIZE.width,
				TILE_SIZE.height,
			)
			break

		case 'starting position':
			context.globalAlpha = 0.6
			context.strokeStyle = blueHex
			context.lineWidth = 2
			context.strokeRect(
				cellX,
				cellY,
				TILE_SIZE.width,
				TILE_SIZE.height,
			)
			break
	}
}
