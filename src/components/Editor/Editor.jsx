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
import styles from './Editor.module.scss'

import { Notifications } from './Notifications.jsx'
import { TILE_SIZE } from '../../game/Tile.js'
import { useDOMEvent } from '../../hooks/useDOMEvent.js'
import { useEditorContext } from './Context/useEditorContext.js'
import { useKeyState } from '../KeyStateContext/KeyStateContext.jsx'
import { useRafael } from '../../hooks/useRafael.js'
import { useStore } from '../../store/react.js'
import { useWindowEvent } from '../../hooks/useWindowEvent.js'





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
	 * Renders an asset cursor to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {HTMLImageElement} options.image The Image of the asset to be rendered.
	 * @param {import('../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
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
	 * Renders the tile brush to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.cursorPosition The current Vector2 of the cursor.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragOffset The distance the cursor has been dragged from its start position.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragStart The position at which the cursor started dragging.
	 * @param {boolean} options.isDragging Whether or not the cursor is being dragged.
	 * @param {number} options.zoom The current zoom level.
	 */
	brush(options) {
		const {
			contentManager,
			context,
			isDragging,
			targetCell,
			targetPixel,
			activeTile,
			zoom,
		} = options

		if (!activeTile) {
			return
		}

		context.setTransform(
			zoom,
			0,
			0,
			zoom,
			0,
			0,
		)

		if (!isDragging) {
			context.globalAlpha = 0.5
		}

		const tile = contentManager.getTile(activeTile.tileID, activeTile.resourcepackID)
		context.drawImage(
			tile.image,
			0,
			0,
			TILE_SIZE.width * 3,
			TILE_SIZE.height * 3,
			targetCell.x,
			targetCell.y,
			TILE_SIZE.width,
			TILE_SIZE.height,
		)

		context.globalAlpha = 1

		context.fillStyle = 'white'
		context.fillRect(targetPixel.x, targetPixel.y, 1, 1)
	},

	/**
	 * Renders destinations to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {HTMLCanvasElement} options.canvasElement The DOM element of the canvas.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
	 * @param {number} options.zoom The current zoom level.
	 */
	destination(options) {
		const {
			context,
			destinations,
			isDestinationsVisible,
			renderOffset,
			tool,
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

		const destinationKeys = Object.keys(destinations)

		if (((tool === 'destination') || isDestinationsVisible) && destinationKeys.length) {
			destinationKeys.forEach(coordinateString => {
				const [cellX, cellY] = coordinateString
					.split('|')
					.map(Number)

				context.globalAlpha = 0.5
				context.strokeStyle = 'black'
				context.lineWidth = 4

				context.strokeRect(
					(cellX * TILE_SIZE.width) + renderOffset.x,
					(cellY * TILE_SIZE.height) + renderOffset.y,
					TILE_SIZE.width,
					TILE_SIZE.height,
				)

				context.globalAlpha = 1
				context.strokeStyle = '#346524'
				context.lineWidth = 2

				context.strokeRect(
					(cellX * TILE_SIZE.width) + renderOffset.x,
					(cellY * TILE_SIZE.height) + renderOffset.y,
					TILE_SIZE.width,
					TILE_SIZE.height,
				)
			})
		}
	},

	/**
	 * Renders the destination cursor to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.cursorPosition The current Vector2 of the cursor.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragOffset The distance the cursor has been dragged from its start position.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragStart The position at which the cursor started dragging.
	 * @param {boolean} options.isDragging Whether or not the cursor is being dragged.
	 * @param {number} options.zoom The current zoom level.
	 */
	destinationCursor(options) {
		const {
			context,
			targetCell,
			targetPixel,
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

		context.globalAlpha = 0.5
		context.fillStyle = '#346524'
		context.lineWidth = '2'
		context.strokeStyle = 'black'

		context.strokeRect(
			targetCell.x,
			targetCell.y,
			TILE_SIZE.width,
			TILE_SIZE.height,
		)
		context.fillRect(
			targetCell.x - 1,
			targetCell.y - 1,
			TILE_SIZE.width + 2,
			TILE_SIZE.height + 2,
		)

		context.globalAlpha = 1

		context.fillStyle = 'white'
		context.fillRect(targetPixel.x, targetPixel.y, 1, 1)
	},

	/**
	 * Renders the eraser brush to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.cursorPosition The current Vector2 of the cursor.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragOffset The distance the cursor has been dragged from its start position.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragStart The position at which the cursor started dragging.
	 * @param {boolean} options.isDragging Whether or not the cursor is being dragged.
	 * @param {number} options.zoom The current zoom level.
	 */
	eraser(options) {
		const {
			context,
			targetCell,
			targetPixel,
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

		context.globalAlpha = 0.3
		context.fillStyle = 'red'
		context.fillRect(targetCell.x, targetCell.y, TILE_SIZE.width, TILE_SIZE.height)

		context.lineWidth = 1
		context.globalAlpha = 0.5
		context.beginPath()
		context.moveTo(targetCell.x, targetCell.y)
		context.lineTo(targetCell.x + TILE_SIZE.width, targetCell.y + TILE_SIZE.height)
		context.stroke()

		context.beginPath()
		context.moveTo(targetCell.x + TILE_SIZE.width, targetCell.y)
		context.lineTo(targetCell.x, targetCell.y + TILE_SIZE.height)
		context.stroke()

		context.globalAlpha = 1

		context.fillStyle = 'white'
		context.fillRect(targetPixel.x, targetPixel.y, 1, 1)
	},

	/**
	 * Renders the transparency grid to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {HTMLCanvasElement} options.canvasElement The DOM element of the canvas.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
	 * @param {number} options.zoom The current zoom level.
	 */
	layers(options) {
		const {
			contentManager,
			context,
			layers,
			renderOffset,
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

		layers.forEach(layer => {
			Object.entries(layer).forEach(([coordinateString, tileData]) => {
				const [cellX, cellY] = coordinateString
					.split('|')
					.map(Number)
				const tile = contentManager.getTile(tileData.tileID, tileData.resourcepackID)

				context.drawImage(
					tile.image,
					0,
					0,
					TILE_SIZE.width * 3,
					TILE_SIZE.height * 3,
					(cellX * TILE_SIZE.width) + renderOffset.x,
					(cellY * TILE_SIZE.height) + renderOffset.y,
					TILE_SIZE.width,
					TILE_SIZE.height,
				)
			})
		})
	},

	/**
	 * Renders the transparency grid to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {HTMLCanvasElement} options.canvasElement The DOM element of the canvas.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
	 * @param {number} options.zoom The current zoom level.
	 */
	mapGrid(options) {
		const {
			canvasElement,
			context,
			renderOffset,
			zoom,
		} = options

		const computedStyles = getComputedStyle(canvasElement)
		const gridColor = computedStyles.getPropertyValue('--palette-purple')

		const gridColumnsOffset = Math.floor(renderOffset.x / TILE_SIZE.width)

		const gridRowsOffset = Math.floor(renderOffset.y / TILE_SIZE.height)

		context.clearRect(
			0,
			0,
			0xffff,
			0xffff,
		)

		context.setTransform(
			zoom,
			0,
			0,
			zoom,
			0,
			0,
		)

		let gridColumn = 0
		let gridRow = 0

		context.globalAlpha = 0.1
		context.strokeStyle = gridColor

		while (gridRow <= canvasElement.height) {
			const rowWidth = gridRow - gridRowsOffset
			const y = (rowWidth * TILE_SIZE.height) + renderOffset.y + 0.5

			context.beginPath()
			context.moveTo(0, y)
			context.lineTo(canvasElement.width, y)
			context.stroke()
			gridRow += 1
		}

		while (gridColumn <= canvasElement.height) {
			const columnWidth = gridColumn - gridColumnsOffset
			const x = (columnWidth * TILE_SIZE.height) + renderOffset.x + 0.5

			context.beginPath()
			context.moveTo(x, 0)
			context.lineTo(x, canvasElement.height)
			context.stroke()
			gridColumn += 1
		}

		context.globalAlpha = 1
	},

	/**
	 * Renders the marquee cursor to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.cursorPosition The current Vector2 of the cursor.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragOffset The distance the cursor has been dragged from its start position.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragStart The position at which the cursor started dragging.
	 * @param {boolean} options.isDragging Whether or not the cursor is being dragged.
	 * @param {number} options.zoom The current zoom level.
	 */
	marquee(options) {
		const {
			context,
			dragOffset,
			dragStart,
			isDragging,
			targetPixel,
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
	 * Renders the pathfinding grid to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {object} options.pfgrid A grid indicating which cells are traversable.
	 * @param {import('../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
	 * @param {number} options.zoom The current zoom level.
	 */
	pathfindingGrid(options) {
		const {
			context,
			pfgrid,
			renderOffset,
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

		context.globalAlpha = 0.5

		Object
			.entries(pfgrid)
			.forEach(([coordinateString, tileState]) => {
				const [cellX, cellY] = coordinateString
					.split('|')
					.map(Number)

				if (tileState.isBlocking) {
					context.fillStyle = 'red'
				} else if (tileState.isTraversable) {
					context.fillStyle = 'purple'
				}

				context.fillRect(
					(cellX * TILE_SIZE.width) + renderOffset.x,
					(cellY * TILE_SIZE.height) + renderOffset.y,
					TILE_SIZE.width,
					TILE_SIZE.height,
				)
			})

		context.globalAlpha = 1
	},

	/**
	 * Renders the selection marquee to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
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
	 * Renders the starting position to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {HTMLCanvasElement} options.canvasElement The DOM element of the canvas.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
	 * @param {number} options.zoom The current zoom level.
	 */
	startingPosition(options) {
		const {
			context,
			isStartingPositionVisible,
			renderOffset,
			startingPosition,
			tool,
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

		if (((tool === 'startingPosition') || isStartingPositionVisible) && startingPosition) {
			context.globalAlpha = 0.5
			context.strokeStyle = 'black'
			context.lineWidth = 4

			context.strokeRect(
				(startingPosition.x * TILE_SIZE.width) + renderOffset.x,
				(startingPosition.y * TILE_SIZE.height) + renderOffset.y,
				TILE_SIZE.width,
				TILE_SIZE.height,
			)

			context.globalAlpha = 1
			context.strokeStyle = '#597dce'
			context.lineWidth = 2

			context.strokeRect(
				(startingPosition.x * TILE_SIZE.width) + renderOffset.x,
				(startingPosition.y * TILE_SIZE.height) + renderOffset.y,
				TILE_SIZE.width,
				TILE_SIZE.height,
			)
		}
	},

	/**
	 * Renders the starting position cursor to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.cursorPosition The current Vector2 of the cursor.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragOffset The distance the cursor has been dragged from its start position.
	 * @param {import('../../types/Vector2.js').Vector2} options.dragStart The position at which the cursor started dragging.
	 * @param {boolean} options.isDragging Whether or not the cursor is being dragged.
	 * @param {number} options.zoom The current zoom level.
	 */
	startingPositionCursor(options) {
		const {
			context,
			targetCell,
			targetPixel,
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

		context.globalAlpha = 0.5
		context.fillStyle = '#597dce'
		context.lineWidth = '2'
		context.strokeStyle = 'black'

		context.strokeRect(
			targetCell.x,
			targetCell.y,
			TILE_SIZE.width,
			TILE_SIZE.height,
		)
		context.fillRect(
			targetCell.x - 1,
			targetCell.y - 1,
			TILE_SIZE.width + 2,
			TILE_SIZE.height + 2,
		)

		context.globalAlpha = 1

		context.fillStyle = 'white'
		context.fillRect(targetPixel.x, targetPixel.y, 1, 1)
	},

	/**
	 * Renders the transparency grid to the canvas.
	 *
	 * @param {object} options All options.
	 * @param {HTMLCanvasElement} options.canvasElement The DOM element of the canvas.
	 * @param {CanvasRenderingContext2D} options.context The context to which to draw.
	 * @param {import('../../types/Vector2.js').Vector2} options.renderOffset The current render offset.
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
	const {
		image,
		showMapGrid,
		showTransparencyGrid,
	} = props

	const { keyState } = useKeyState()

	const {
		activeTile,
		destinations,
		eraseTile,
		isDestinationsVisible,
		isPathfindingGridVisible,
		isStartingPositionVisible,
		layers,
		paintTile,
		pfgrid,
		selection,
		setSelection,
		setStartingPosition,
		startingPosition,
		toggleDestination,
		tool,
		zoom,
	} = useEditorContext()

	const contentManager = useStore(state => state.contentManager)

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

	const isErasable = useMemo(() => {
		return !keyState[' '] && (tool === 'eraser')
	}, [
		keyState,
		tool,
	])

	const isPaintable = useMemo(() => {
		return !keyState[' '] && (tool === 'brush')
	}, [
		keyState,
		tool,
	])

	const isMovable = useMemo(() => {
		return keyState[' '] || (tool === 'move')
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

	const handleCanvasRelease = useCallback(options => {
		const { isLeaving } = options

		if (isDragging) {
			if (isMovable) {
				setCanvasOffset(previousValue => ({
					x: previousValue.x + dragOffset.x,
					y: previousValue.y + dragOffset.y,
				}))
			} else if (tool === 'marquee') {
				setSelection({
					height: Math.abs(dragOffset.y) + 1,
					width: Math.abs(dragOffset.x) + 1,
					x: dragStart.x - renderOffset.x + ((dragOffset.x < 0 ? dragOffset.x : 0)),
					y: dragStart.y - renderOffset.y + ((dragOffset.y < 0 ? dragOffset.y : 0))
				})
			}

			setDragOffset(() => ({
				x: 0,
				y: 0,
			}))
			setIsDragging(false)
		} else if (!isLeaving) {
			if (tool === 'brush') {
				paintTile({
					cellX: Math.floor((Math.floor(cursorPosition.x) - renderOffset.x) / TILE_SIZE.width),
					cellY: Math.floor((Math.floor(cursorPosition.y) - renderOffset.y) / TILE_SIZE.height),
				})
			} else if (tool === 'eraser') {
				eraseTile({
					cellX: Math.floor((Math.floor(cursorPosition.x) - renderOffset.x) / TILE_SIZE.width),
					cellY: Math.floor((Math.floor(cursorPosition.y) - renderOffset.y) / TILE_SIZE.height),
				})
			} else if (tool === 'startingPosition') {
				setStartingPosition({
					x: Math.floor((Math.floor(cursorPosition.x) - renderOffset.x) / TILE_SIZE.width),
					y: Math.floor((Math.floor(cursorPosition.y) - renderOffset.y) / TILE_SIZE.height),
				})
			} else if (tool === 'destination') {
				toggleDestination({
					x: Math.floor((Math.floor(cursorPosition.x) - renderOffset.x) / TILE_SIZE.width),
					y: Math.floor((Math.floor(cursorPosition.y) - renderOffset.y) / TILE_SIZE.height),
				})
			}
		}
	}, [
		cursorPosition,
		dragOffset,
		dragStart,
		eraseTile,
		isDragging,
		isMovable,
		paintTile,
		renderOffset,
		setCanvasOffset,
		setDragOffset,
		setIsDragging,
		setSelection,
		setStartingPosition,
		tool,
	])

	const handleDoubleClick = useCallback(event => {
		if (tool !== 'marquee') {
			return
		}

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
					newState.width = Math.max(previousState.width, (x - previousState.x) + TILE_SIZE.width)
					newState.x = previousState.x
				} else {
					newState.width = Math.max(previousState.width, (previousState.x - x) + TILE_SIZE.width)
				}

				if (newState.y > previousState.y) {
					newState.height = Math.max(previousState.height, (y - previousState.y) + TILE_SIZE.height)
					newState.y = previousState.y
				} else {
					newState.height = Math.max(previousState.height, (previousState.y - y) + TILE_SIZE.height)
				}
			}

			return newState
		})
	}, [
		renderOffset,
		setSelection,
		tool,
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
		handleCanvasRelease({ isLeaving: true })
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

		const targetPixel = {
			x: Math.floor(cursorPosition.x),
			y: Math.floor(cursorPosition.y),
		}

		const cursorCellX = Math.floor((targetPixel.x - renderOffset.x) / TILE_SIZE.width)
		const cursorCellY = Math.floor((targetPixel.y - renderOffset.y) / TILE_SIZE.height)

		const gridCellX = cursorCellX * TILE_SIZE.width
		const gridCellY = cursorCellY * TILE_SIZE.height
		const gridOffsetX = renderOffset.x
		const gridOffsetY = renderOffset.y

		const targetCell = {
			x: gridCellX + gridOffsetX,
			y: gridCellY + gridOffsetY,
		}

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

		if (showTransparencyGrid) {
			RENDERERS.transparencyGrid({
				canvasElement,
				context,
				renderOffset,
				zoom,
			})
		}

		if (showMapGrid) {
			RENDERERS.mapGrid({
				canvasElement,
				context,
				renderOffset,
				zoom,
			})
		}

		if (image) {
			RENDERERS.asset({
				context,
				image,
				renderOffset,
				zoom,
			})
		}

		RENDERERS.layers({
			contentManager,
			context,
			layers,
			renderOffset,
			zoom,
		})

		if (isPathfindingGridVisible) {
			RENDERERS.pathfindingGrid({
				canvasElement,
				context,
				pfgrid,
				renderOffset,
				zoom,
			})
		}

		RENDERERS.destination({
			context,
			destinations,
			isDestinationsVisible,
			renderOffset,
			tool,
			zoom,
		})

		RENDERERS.startingPosition({
			context,
			isStartingPositionVisible,
			renderOffset,
			startingPosition,
			tool,
			zoom,
		})

		let renderer = tool

		if (['destination', 'startingPosition'].includes(tool)) {
			renderer = `${tool}Cursor`
		}

		if (cursorIsOverCanvas && !isMovable && (typeof RENDERERS[renderer] === 'function')) {
			RENDERERS[renderer]({
				activeTile,
				contentManager,
				context,
				cursorPosition,
				dragOffset,
				dragStart,
				isDragging,
				renderOffset,
				targetCell,
				targetPixel,
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
		activeTile,
		contentManager,
		cursorIsOverCanvas,
		cursorPosition,
		dragOffset,
		dragStart,
		image,
		isDragging,
		isMovable,
		layers,
		pfgrid,
		renderOffset,
		selection,
		showMapGrid,
		showTransparencyGrid,
		tool,
		zoom,
	])

	const compiledClassName = useMemo(() => {
		return classnames(styles['editor'], {
			[styles['is-movable']]: isMovable && !isDragging,
			[styles['is-moving']]: isMovable && isDragging,
		})
	}, [
		isDragging,
		isMovable,
	])

	useEffect(() => {
		if (isDragging) {
			if (isPaintable) {
				paintTile({
					cellX: Math.floor((Math.floor(cursorPosition.x) - renderOffset.x) / TILE_SIZE.width),
					cellY: Math.floor((Math.floor(cursorPosition.y) - renderOffset.y) / TILE_SIZE.height),
				})
			} else if (isErasable) {
				eraseTile({
					cellX: Math.floor((Math.floor(cursorPosition.x) - renderOffset.x) / TILE_SIZE.width),
					cellY: Math.floor((Math.floor(cursorPosition.y) - renderOffset.y) / TILE_SIZE.height),
				})
			}
		}
	}, [
		cursorPosition,
		eraseTile,
		isDragging,
		isErasable,
		isPaintable,
		paintTile,
		renderOffset,
		tool,
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

			<Notifications />
		</div>
	)
}

Editor.defaultProps = {
	image: null,
	showMapGrid: false,
	showTransparencyGrid: true,
}

Editor.propTypes = {
	image: PropTypes.instanceOf(Image),
	showMapGrid: PropTypes.bool,
	showTransparencyGrid: PropTypes.bool,
}
