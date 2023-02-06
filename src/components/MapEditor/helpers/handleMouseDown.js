// Local imports
import {
	activateTool,
	eraseTile,
	paintTile,
	setStartingPosition,
	store,
	toggleDestination,
} from '../store.js'





export function handleMouseDown() {
	const { tool } = store.state

	activateTool()

	switch (tool) {
		case 'brush':
			paintTile()
			break

		case 'destination': {
			toggleDestination()
			break
		}

		case 'eraser': {
			eraseTile()
			break
		}

		case 'starting position':
			setStartingPosition()
			break
	}
}
