// Module imports
import {
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { TILE_SIZE } from '../../../game/Tile.js'
import { useDOMEvent } from '../../../hooks/useDOMEvent.js'
import { useEditor } from './context/EditorContext.jsx'
import { useKeyState } from './context/KeyStateContext.jsx'
import { useRafael } from '../../../hooks/useRafael.js'
import { useWindowEvent } from '../../../hooks/useWindowEvent.js'





// Constants
const MARQUEE_CURSOR_PATHS = [
	// top left
	[
		[-2, 0],
		[0, 0],
		[0, -2],
		[-1, -2],
		[-1, -1],
		[-2, -1],
	],

	// top right
	[
		[3, 0],
		[1, 0],
		[1, -2],
		[2, -2],
		[2, -1],
		[3, -1],
	],

	// bottom left
	[
		[-2, 1],
		[0, 1],
		[0, 3],
		[-1, 3],
		[-1, 2],
		[-2, 2],
	],

	// bottom left
	[
		[3, 1],
		[1, 1],
		[1, 3],
		[2, 3],
		[2, 2],
		[3, 2],
	],
]

const RENDERERS = {
	/**
	 * Renders the marquee cursor to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {HTMLImageElement} options.image The Image of the asset to be rendered.
	 * @param {import('../../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
	 * @param {number} options.zoom The current zoom level.
	 */
	asset(options) {
		const {
			context,
			image,
			renderOffset,
			zoom,
		} = options

		context.setTransform(
			zoom,
			0,
			0,
			zoom,
			renderOffset.x * zoom,
			renderOffset.y * zoom,
		)
		context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height)
	},

	/**
	 * Renders the marquee cursor to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../../types/Vector2.js').Vector2} options.cursorPosition The current Vector2 of the cursor.
	 * @param {import('../../../types/Vector2.js').Vector2} options.dragOffset The distance the cursor has been dragged from its start position.
	 * @param {import('../../../types/Vector2.js').Vector2} options.dragStart The position at which the cursor started dragging.
	 * @param {boolean} options.isDragging Whether or not the cursor is being dragged.
	 * @param {number} options.zoom The current zoom level.
	 */
	marquee(options) {
		const {
			context,
			cursorPosition,
			dragOffset,
			dragStart,
			isDragging,
			zoom,
		} = options

		context.setTransform(
			zoom,
			0,
			0,
			zoom,
			0,
			0,
		)

		const targetPixel = {
			x: Math.floor(cursorPosition.x),
			y: Math.floor(cursorPosition.y),
		}

		context.fillStyle = 'white'
		context.strokeStyle = 'white'
		context.lineWidth = 1
		context.globalCompositeOperation = 'difference'

		MARQUEE_CURSOR_PATHS.forEach(cursorPath => {
			context.beginPath()

			cursorPath.forEach((cursorPathPoint, index) => {
				let method = 'lineTo'

				if (index === 0) {
					method = 'moveTo'
				}

				context[method](
					targetPixel.x + cursorPathPoint[0],
					targetPixel.y + cursorPathPoint[1],
				)
			})
			context.closePath()
			context.fill()
		})

		if (isDragging) {
			const lineWidth = 1
			context.strokeStyle = 'white'
			context.lineWidth = lineWidth

			context.setTransform(
				zoom,
				0,
				0,
				zoom,
				0,
				0,
			)

			const renderHeight = Math.round(dragOffset.y)
			const renderWidth = Math.round(dragOffset.x)
			const renderX = Math.round(dragStart.x) + (lineWidth / 2)
			const renderY = Math.round(dragStart.y) + (lineWidth / 2)

			context.strokeRect(
				renderX,
				renderY,
				renderWidth,
				renderHeight,
			)
		}

		context.globalCompositeOperation = 'source-over'
	},

	/**
	 * Renders the marquee cursor to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
	 * @param {object} options.selection The location and size of the current selection.
	 * @param {number} options.selection.height The height of the current selection.
	 * @param {number} options.selection.width The width of the current selection.
	 * @param {number} options.selection.x The horizontal location of the current selection.
	 * @param {number} options.selection.y The vertical location of the current selection.
	 * @param {number} options.zoom The current zoom level.
	 */
	selection(options) {
		const {
			context,
			renderOffset,
			selection,
			zoom,
		} = options

		const lineWidth = 1

		context.setTransform(
			zoom,
			0,
			0,
			zoom,
			0,
			0,
		)
		context.globalCompositeOperation = 'difference'
		context.lineDashOffset = performance.now() * -0.01
		context.lineWidth = lineWidth
		context.setLineDash([3, 3])

		context.strokeRect(
			Math.floor(selection.x + renderOffset.x) + (lineWidth / 2),
			Math.floor(selection.y + renderOffset.y) + (lineWidth / 2),
			Math.floor(selection.width) - 1,
			Math.floor(selection.height) - 1,
		)

		context.globalCompositeOperation = 'source-over'
		context.lineDashOffset = 0
		context.setLineDash([])
	},

	/**
	 * Renders the transparency grid to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {HTMLCanvasElement} options.canvasElement The DOM element of the canvas.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
	 * @param {number} options.zoom The current zoom level.
	 */
	transparencyGrid(options) {
		const {
			canvasElement,
			context,
			renderOffset,
			zoom,
		} = options

		// Draw light background
		context.fillStyle = '#eee'
		context.fillRect(
			0,
			0,
			canvasElement.width,
			canvasElement.height,
		)

		context.setTransform(
			zoom,
			0,
			0,
			zoom,
			0,
			0,
		)

		// Draw darker grid squares
		const gridCellsX = Math.ceil(canvasElement.width / TILE_SIZE.width)
		const gridCellsY = Math.ceil(canvasElement.height / TILE_SIZE.height)
		const gridOffsetX = Math.floor(renderOffset.x / TILE_SIZE.width)
		const gridOffsetY = Math.floor(renderOffset.y / TILE_SIZE.height)
		const gridStartX = -1
		const gridStartY = -1

		context.fillStyle = '#ddd'

		let gridX = gridStartX
		let gridY = gridStartY
		while (gridY < gridCellsY) {
			while (gridX < gridCellsX) {
				const cellX = gridX - gridOffsetX
				const cellY = gridY - gridOffsetY

				if (!((cellX + cellY) % 2)) {
					context.fillRect(
						(cellX * TILE_SIZE.width) + renderOffset.x,
						(cellY * TILE_SIZE.height) + renderOffset.y,
						TILE_SIZE.width,
						TILE_SIZE.height,
					)
				}

				gridX += 1
			}

			gridX = gridStartX
			gridY += 1
		}
	},
}

export function Editor(props) {
	const { image } = props
	const { keyState } = useKeyState()
	const {
		selection,
		setSelection,
		tool,
		zoom,
	} = useEditor()
	const canvasRef = useRef(null)
	const parentRef = useRef(null)
	const [canvasSize, setCanvasSize] = useState({
		height: 0,
		width: 0,
	})
	const [canvasOffset, setCanvasOffset] = useState({
		x: 0,
		y: 0,
	})
	const [cursorIsOverCanvas, setCursorIsOverCanvas] = useState(false)
	const [cursorPosition, setCursorPosition] = useState({
		x: 0,
		y: 0,
	})
	const [dragOffset, setDragOffset] = useState({
		x: 0,
		y: 0,
	})
	const [dragStart, setDragStart] = useState({
		x: 0,
		y: 0,
	})
	const [isDragging, setIsDragging] = useState(false)

	const isMovable = useMemo(() => {
		return keyState[' '] || (tool === 'hand')
	}, [
		keyState,
		tool,
	])

	const renderOffset = useMemo(() => {
		return {
			x: Math.floor(canvasOffset.x + (isMovable ? dragOffset.x : 0)),
			y: Math.floor(canvasOffset.y + (isMovable ? dragOffset.y : 0)),
		}
	}, [
		canvasOffset,
		dragOffset,
		isMovable,
	])

	const handleCanvasDragStart = useCallback(event => {
		const { nativeEvent } = event

		event.preventDefault()

		setDragStart({
			x: Math.floor(nativeEvent.layerX / zoom),
			y: Math.floor(nativeEvent.layerY / zoom),
		})
		setIsDragging(true)
	}, [
		setDragStart,
		setIsDragging,
		zoom,
	])

	const handleCanvasRelease = useCallback(() => {
		if (isDragging) {
			if (isMovable) {
				setCanvasOffset(previousValue => ({
					x: previousValue.x + dragOffset.x,
					y: previousValue.y + dragOffset.y,
				}))
			} else if (tool === 'marquee') {
				setSelection({
					height: dragOffset.y + canvasOffset.y + 1,
					width: dragOffset.x + canvasOffset.x + 1,
					x: dragStart.x,
					y: dragStart.y,
				})
			}

			setDragOffset(() => ({
				x: 0,
				y: 0,
			}))
			setIsDragging(false)
		}
	}, [
		canvasOffset,
		dragOffset,
		dragStart,
		isDragging,
		isMovable,
		setCanvasOffset,
		setDragOffset,
		setIsDragging,
		setSelection,
		tool,
	])

	const handleDoubleClick = useCallback(event => {
		const x = Math.floor(((event.layerX / zoom) - renderOffset.x) / TILE_SIZE.width) * TILE_SIZE.width
		const y = Math.floor(((event.layerY / zoom) - renderOffset.y) / TILE_SIZE.height) * TILE_SIZE.height

		setSelection(previousState => {
			const newState = {
				height: TILE_SIZE.height,
				width: TILE_SIZE.width,
				x,
				y,
			}

			if (event.shiftKey) {
				if (newState.x > previousState.x) {
					newState.width = (x - previousState.x) + TILE_SIZE.width
					newState.x = previousState.x
				} else {
					newState.width = (previousState.x - x) + TILE_SIZE.width
				}

				if (newState.y > previousState.y) {
					newState.height = (y - previousState.y) + TILE_SIZE.height
					newState.y = previousState.y
				} else {
					newState.height = (previousState.y - y) + TILE_SIZE.height
				}
			}

			return newState
		})
	}, [
		renderOffset,
		setSelection,
		zoom,
	])

	const handleKeyUp = useCallback(event => {
		if (event.key.toLowerCase() === 'escape') {
			if (selection) {
				setSelection(null)
			}
		}
	}, [
		selection,
		setSelection,
	])

	const handleMouseLeave = useCallback(() => {
		setCursorIsOverCanvas(false)
		handleCanvasRelease()
	}, [
		handleCanvasRelease,
		setCursorIsOverCanvas,
	])

	const handleMouseMove = useCallback(event => {
		const { nativeEvent } = event

		setCursorIsOverCanvas(true)
		setCursorPosition({
			x: Math.floor(nativeEvent.layerX / zoom),
			y: Math.floor(nativeEvent.layerY / zoom),
		})

		if (isDragging) {
			setDragOffset(() => {
				return {
					x: Math.floor(nativeEvent.layerX / zoom) - dragStart.x,
					y: Math.floor(nativeEvent.layerY / zoom) - dragStart.y,
				}
			})
		}
	}, [
		dragStart,
		isDragging,
		setCursorIsOverCanvas,
		setCursorPosition,
		setDragOffset,
		zoom,
	])

	const updateCanvas = useCallback(() => {
		const parentElement = parentRef.current

		const heightMatches = parentElement.clientHeight === canvasSize.height
		const widthMatches = parentElement.clientWidth === canvasSize.width

		if (!heightMatches || !widthMatches) {
			setCanvasSize({
				height: parentElement.clientHeight,
				width: parentElement.clientWidth,
			})
		}
	}, [
		canvasSize,
		setCanvasSize,
	])

	const render = useCallback(() => {
		const canvasElement = canvasRef.current

		if (!canvasElement) {
			return
		}

		const context = canvasRef.current.getContext('2d')

		context.imageSmoothingEnabled = false
		context.setTransform(
			zoom,
			0,
			0,
			zoom,
			0,
			0,
		)

		context.clearRect(
			0,
			0,
			canvasElement.width,
			canvasElement.height,
		)

		RENDERERS.transparencyGrid({
			canvasElement,
			context,
			renderOffset,
			zoom,
		})

		RENDERERS.asset({
			context,
			image,
			renderOffset,
			zoom,
		})

		if (cursorIsOverCanvas && !isMovable && (typeof RENDERERS[tool] === 'function')) {
			RENDERERS[tool]({
				context,
				cursorPosition,
				dragOffset,
				dragStart,
				isDragging,
				renderOffset,
				zoom,
			})
		}

		if (selection) {
			RENDERERS.selection({
				context,
				renderOffset,
				selection,
				zoom,
			})
		}
	}, [
		cursorIsOverCanvas,
		cursorPosition,
		dragOffset,
		dragStart,
		image,
		isDragging,
		isMovable,
		renderOffset,
		selection,
		tool,
		zoom,
	])

	const compiledClassName = useMemo(() => {
		return classnames('editor', {
			'is-movable': isMovable && !isDragging,
			'is-moving': isMovable && isDragging,
		})
	}, [
		isDragging,
		isMovable,
	])

	useRafael({
		task: render,
		dependencies: [render],
	})

	useWindowEvent({
		event: 'resize',
		invokeImmediately: true,
		handler: updateCanvas,
	})

	useWindowEvent({
		event: 'keyup',
		handler: handleKeyUp,
	})

	useDOMEvent({
		elementRef: canvasRef,
		event: 'dblclick',
		handler: handleDoubleClick,
	})

	return (
		<div
			ref={parentRef}
			className={compiledClassName}>
			<canvas
				ref={canvasRef}
				draggable
				height={canvasSize.height}
				onDragStart={handleCanvasDragStart}
				onMouseLeave={handleMouseLeave}
				onMouseMove={handleMouseMove}
				onMouseUp={handleCanvasRelease}
				width={canvasSize.width} />
		</div>
	)
}

Editor.propTypes = {
	image: PropTypes.instanceOf(Image).isRequired,
}
