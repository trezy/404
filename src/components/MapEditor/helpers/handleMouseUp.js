// Local imports
import {
	deactivateTool,
	endDrag,
} from '../store.js'





export function handleMouseUp() {
	deactivateTool()
	endDrag()
}
