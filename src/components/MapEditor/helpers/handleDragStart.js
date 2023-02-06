// Local imports
import { startDrag } from '../store.js'
import { store } from '../store.js'





export function handleDragStart(event) {
	event.preventDefault()

	const { tool } = store.state

	if (tool !== 'move') {
		return
	}

	const {
		layerX,
		layerY,
	} = event

	startDrag(Math.floor(layerX), Math.floor(layerY))
}
