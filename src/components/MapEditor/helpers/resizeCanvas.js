// Local imports
import { store } from '../store.js'





export function resizeCanvas(canvasElement) {
	const { resolution } = store.state

	const {
		clientHeight,
		clientWidth,
	} = canvasElement.parentNode

	canvasElement.height = Math.floor(clientHeight * resolution)
	canvasElement.width = Math.floor(clientWidth * resolution)

	canvasElement.style.height = `${clientHeight}px`
	canvasElement.style.width = `${clientWidth}px`
}
