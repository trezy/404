// Local imports
import { store } from '../store.js'
import { TILE_SIZE } from '../../../game/Tile.js'





export function drawGrid(canvasElement) {
	const context = canvasElement.getContext('2d')
	const computedStyles = getComputedStyle(canvasElement)
	const gridColor = computedStyles.getPropertyValue('--palette-purple')

	const { uiScale } = store.state

	// const gridColumnsOffset = Math.floor(renderOffset.x / TILE_SIZE.width)

	// const gridRowsOffset = Math.floor(renderOffset.y / TILE_SIZE.height)
	const gridColumnsOffset = 0
	const gridRowsOffset = 0

	context.clearRect(
		0,
		0,
		0xffff,
		0xffff,
	)

	let gridColumn = 0
	let gridRow = 0

	context.globalAlpha = 0.1
	context.strokeStyle = gridColor

	while (gridRow <= canvasElement.height) {
		const rowWidth = gridRow - gridRowsOffset
		const y = (rowWidth * TILE_SIZE.height) /*+ renderOffset.y*/ + 0.5

		context.beginPath()
		context.moveTo(0, y)
		context.lineTo(canvasElement.width, y)
		context.stroke()
		gridRow += 1
	}

	while (gridColumn <= canvasElement.height) {
		const columnWidth = gridColumn - gridColumnsOffset
		const x = (columnWidth * TILE_SIZE.height) /*+ renderOffset.x*/ + 0.5

		context.beginPath()
		context.moveTo(x, 0)
		context.lineTo(x, canvasElement.height)
		context.stroke()
		gridColumn += 1
	}

	context.globalAlpha = 1
}
