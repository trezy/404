// Local imports
import { resetTransform } from './resetTransform.js'





export function clearCanvas(canvasElement) {
	const context = canvasElement.getContext('2d')

	resetTransform(canvasElement)

	context.clearRect(0, 0, canvasElement.width, canvasElement.height)
}
