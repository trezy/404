// Local imports
import {
	endDrag,
	unsetCursorPosition,
} from '../store.js'





export function handleMouseLeave() {
	endDrag()
	unsetCursorPosition()
}
