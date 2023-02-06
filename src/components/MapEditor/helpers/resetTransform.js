// Local imports
import { store } from '../store.js'





export function resetTransform(canvasElement) {
	const context = canvasElement.getContext('2d')
	const {
		dragOffset,
		renderOffset,
		resolution,
		uiScale,
	} = store.state

	const pixelSize = resolution * uiScale

	context.setTransform(
		pixelSize,
		0,
		0,
		pixelSize,
		(renderOffset.x + dragOffset.x) * pixelSize,
		(renderOffset.y + dragOffset.y) * pixelSize,
	)
	context.globalAlpha = 1
}
