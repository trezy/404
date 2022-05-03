// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { useEditor } from './context/EditorContext.jsx'
import { useKeyState } from './context/KeyStateContext.jsx'
import { useRafael } from '../../../hooks/useRafael.js'





const CURSOR_RENDERERS = {
	/**
	 * Renders the marquee cursor to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which the cursor will be drawn.
	 * @param {object} options.cursorPosition The current Vector2 of the cursor.
	 * @param {object} options.zoom The current zoom level.
	 */
	marquee(options) {
		const {
			context,
			cursorPosition,
			zoom,
		} = options

		const nativePixelSize = 1 / zoom
		const lineWidth = nativePixelSize * 4

		const targetPixel = {
			x: Math.ceil(cursorPosition.x / zoom),
			y: Math.ceil(cursorPosition.y / zoom),
		}

		context.fillStyle = 'white'
		context.strokeStyle = 'white'
		context.lineWidth = lineWidth
		context.globalCompositeOperation = 'difference'

		// top left
		context.beginPath()
		context.moveTo(
			targetPixel.x - (lineWidth / 2) - 1 - (lineWidth * 2),
			targetPixel.y - (lineWidth / 2) - 1,
		)
		context.lineTo(
			targetPixel.x - (lineWidth / 2) - 1,
			targetPixel.y - (lineWidth / 2) - 1,
		)
		context.lineTo(
			targetPixel.x - (lineWidth / 2) - 1,
			targetPixel.y - (lineWidth / 2) - 1 - (lineWidth * 2),
		)
		context.stroke()

		// top right
		context.beginPath()
		context.moveTo(
			targetPixel.x + (lineWidth / 2) + (lineWidth * 2),
			targetPixel.y - (lineWidth / 2) - 1,
		)
		context.lineTo(
			targetPixel.x + (lineWidth / 2),
			targetPixel.y - (lineWidth / 2) - 1,
		)
		context.lineTo(
			targetPixel.x + (lineWidth / 2),
			targetPixel.y - (lineWidth / 2) - 1 - (lineWidth * 2),
		)
		context.stroke()

		// bottom right
		context.beginPath()
		context.moveTo(
			targetPixel.x + (lineWidth / 2) + (lineWidth * 2),
			targetPixel.y + (lineWidth / 2),
		)
		context.lineTo(
			targetPixel.x + (lineWidth / 2),
			targetPixel.y + (lineWidth / 2),
		)
		context.lineTo(
			targetPixel.x + (lineWidth / 2),
			targetPixel.y + (lineWidth / 2) + (lineWidth * 2),
		)
		context.stroke()

		// bottom left
		context.beginPath()
		context.moveTo(
			targetPixel.x - (lineWidth / 2) - 1 - (lineWidth * 2),
			targetPixel.y + (lineWidth / 2),
		)
		context.lineTo(
			targetPixel.x - (lineWidth / 2) - 1,
			targetPixel.y + (lineWidth / 2),
		)
		context.lineTo(
			targetPixel.x - (lineWidth / 2) - 1,
			targetPixel.y + (lineWidth / 2) + (lineWidth * 2),
		)
		context.stroke()

		context.globalCompositeOperation = 'source-over'
	},
}

export function Editor(props) {
	const { image } = props
	const { keyState } = useKeyState()
	const {
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

	const handleCanvasClick = useCallback(event => {
		if (isMovable) {
			setDragStart({
				x: event.screenX,
				y: event.screenY,
			})
			setIsDragging(true)
		}
	}, [
		isMovable,
		setDragStart,
		setIsDragging,
	])

	const handleCanvasRelease = useCallback(() => {
		if (isDragging) {
			setCanvasOffset(previousValue => ({
				x: previousValue.x + dragOffset.x,
				y: previousValue.y + dragOffset.y,
			}))
			setDragOffset(() => ({
				x: 0,
				y: 0,
			}))
			setIsDragging(false)
		}
	}, [
		dragOffset,
		isDragging,
		setCanvasOffset,
		setDragOffset,
		setIsDragging,
	])

	const handleMouseLeave = useCallback(() => {
		setCursorIsOverCanvas(false)
		handleCanvasRelease()
	}, [
		handleCanvasRelease,
		setCursorIsOverCanvas,
	])

	const handleMouseMove = useCallback(event => {
		setCursorIsOverCanvas(true)
		setCursorPosition({
			x: event.nativeEvent.layerX,
			y: event.nativeEvent.layerY,
		})

		if (isDragging) {
			const {
				screenX,
				screenY,
			} = event

			setDragOffset(() => {
				return {
					x: screenX - dragStart.x,
					y: screenY - dragStart.y,
				}
			})
		}
	}, [
		dragStart,
		isDragging,
		setCursorIsOverCanvas,
		setCursorPosition,
		setDragOffset,
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

		const {
			height,
			width,
		} = image
		const offsetX = Math.floor((canvasOffset.x + dragOffset.x) / zoom)
		const offsetY = Math.floor((canvasOffset.y + dragOffset.y) / zoom)

		context.clearRect(0, 0, canvasElement.width, canvasElement.height)

		// Draw the grid
		const gridOffsetX = (32 - (offsetX % 32)) * -1
		const gridOffsetY = (32 - (offsetY % 32)) * -1
		const gridWidth = ((Math.ceil(canvasSize.width / 16) * 16) / zoom) + 64
		const gridHeight = ((Math.ceil(canvasSize.height / 16) * 16) / zoom) + 64

		context.fillStyle = '#eee'
		context.fillRect(gridOffsetX, gridOffsetY, gridWidth, gridHeight)

		context.fillStyle = '#ddd'

		for (let i = 0; i < gridWidth; i += 16) {
			const shouldOffset = Boolean((i / 16) % 2)
			const x = gridOffsetX + i
			let y = gridOffsetY

			if (shouldOffset) {
				y += 16
			}

			for (let iY = 0; iY < gridHeight; iY += 32) {
				context.fillRect(x, y + iY, 16, 16)
			}
		}

		context.drawImage(image, 0, 0, width, height, offsetX, offsetY, width, height)

		if (cursorIsOverCanvas && !isMovable && (typeof CURSOR_RENDERERS[tool] === 'function')) {
			CURSOR_RENDERERS[tool]({
				context,
				cursorPosition,
				zoom,
			})
		}
	}, [
		cursorIsOverCanvas,
		canvasOffset,
		canvasSize,
		cursorPosition,
		dragOffset,
		image,
		isMovable,
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

	useEffect(() => {
		window.addEventListener('resize', updateCanvas)
		updateCanvas()

		return () => window.removeEventListener('resize', updateCanvas)
	}, [updateCanvas])

	useRafael({
		task: render,
		dependencies: [render],
	})

	return (
		<div
			ref={parentRef}
			className={compiledClassName}>
			<canvas
				ref={canvasRef}
				height={canvasSize.height}
				onMouseDown={handleCanvasClick}
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
