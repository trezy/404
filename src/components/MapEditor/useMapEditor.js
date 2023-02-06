// Module imports
import { useEffect } from 'react'




// Local imports
import { clearCanvas } from './helpers/clearCanvas.js'
import { drawContent } from './helpers/drawContent.js'
import { drawCursor } from './helpers/drawCursor.js'
import { drawGrid } from './helpers/drawGrid.js'
import { drawPathfindingGrid } from './helpers/drawPathfindingGrid.js'
import { handleDragStart } from './helpers/handleDragStart.js'
import { handleMouseDown } from './helpers/handleMouseDown.js'
import { handleMouseLeave } from './helpers/handleMouseLeave.js'
import { handleMouseMove } from './helpers/handleMouseMove.js'
import { handleMouseUp } from './helpers/handleMouseUp.js'
import { resizeCanvas } from './helpers/resizeCanvas.js'





export function useMapEditor(options) {
	const {
		canvasRef,
		dependencies = [],
	} = options

	useEffect(() => {
		const canvasElement = canvasRef.current

		if (!canvasElement) {
			return
		}

		canvasElement.addEventListener('dragstart', handleDragStart)
		canvasElement.addEventListener('mousedown', handleMouseDown)
		canvasElement.addEventListener('mouseleave', handleMouseLeave)
		canvasElement.addEventListener('mousemove', handleMouseMove)
		canvasElement.addEventListener('mouseup', handleMouseUp)

		return () => {
			canvasElement.removeEventListener('dragstart', handleDragStart)
			canvasElement.removeEventListener('mousedown', handleMouseDown)
			canvasElement.removeEventListener('mouseleave', handleMouseLeave)
			canvasElement.removeEventListener('mousemove', handleMouseMove)
			canvasElement.removeEventListener('mouseup', handleMouseUp)
		}
	}, [
		canvasRef,
		...dependencies,
	])

	useEffect(() => {
		const canvasElement = canvasRef.current

		if (!canvasElement) {
			return
		}

		let shouldContinue = true

		const loop = () => {
			if (!shouldContinue) {
				return
			}

			// Update canvas size
			resizeCanvas(canvasElement)

			// Clear the canvas
			clearCanvas(canvasElement)

			// Draw the grid
			drawGrid(canvasElement)

			// Draw the content (either a map or a tileset from the queue)
			drawContent(canvasElement)

			// Draw the cursor
			drawPathfindingGrid(canvasElement)

			// Draw the cursor
			drawCursor(canvasElement)

			// Continue the loop
			requestAnimationFrame(loop)
		}

		loop()

		return () => {
			shouldContinue = false
		}
	}, [
		canvasRef,
		...dependencies,
	])
}
