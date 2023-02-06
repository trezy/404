// Local imports
import {
	eraseTile,
	paintTile,
	setCursorPosition,
	store,
	updateDrag,
} from '../store.js'





export function handleMouseMove(event) {
	const {
		offsetX,
		offsetY,
	} = event
	const {
		dragStartOffset,
		tool,
		toolIsActive,
	} = store.state

	setCursorPosition(offsetX, offsetY)

	if (dragStartOffset) {
		updateDrag(offsetX, offsetY)
	}

	if (toolIsActive) {
		switch (tool) {
			case 'brush':
				paintTile()
				break

			case 'eraser':
				eraseTile()
				break
		}
	}
}
