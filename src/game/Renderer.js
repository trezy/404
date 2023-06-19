// Module imports
import {
	Application,
	BaseTexture,
	extensions,
	Graphics,
	SCALE_MODES,
	settings,
	Spritesheet,
} from 'pixi.js'





// Local imports
import { store } from '../newStore/store.js'
import { TILE_SIZE } from './Tile.js'





// Constants
export const LAYERS = {
	background: 0,
	foreground: 1,
	sprites: 2,
}





/**
 * A renderer to control canvas operations.
 *
 * @deprecated
 */
export class Renderer {
	/****************************************************************************\
	 * Public instance properties
	\****************************************************************************/

	canvas = null

	layer = LAYERS.background

	needsResize = true

	pixelSize = 1

	pixiApp = null

	queue = [
		[], // background
		[], // foreground
		[], // sprites
	]

	resizeObserver = null

	shadow = null

	target = null





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Disconnect the resize observer.
	 */
	disconnectResizeObserver() {
		this.resizeObserver?.disconnect()
	}

	/**
	 * Draw the background grid to the shadow canvas.
	 *
	 * @param {number} mapWidth The width of the map that will be rendered on top of the grid.
	 * @param {number} mapHeight The height of the map that will be rendered on top of the grid.
	 */
	drawGrid() {
		const { pixiApp } = store.state
		const gridManager = new Graphics

		gridManager.beginFill(this.gridColor, 0.1)
		gridManager.drawRect(
			0,
			0,
			this.width,
			this.height,
		)
		gridManager.endFill()

		gridManager.beginHole()

		const renderHeight = Math.ceil(this.height / TILE_SIZE.height) + 2
		const renderWidth = Math.ceil(this.width / TILE_SIZE.width) + 2

		let column = 0
		let row = 0

		while (row <= renderHeight) {
			while (column <= renderWidth) {
				gridManager.drawRect(
					(column * TILE_SIZE.width) + 1,
					(row * TILE_SIZE.height) + 1,
					TILE_SIZE.width - 1,
					TILE_SIZE.height - 1,
				)
				column += 1
			}

			column = 0
			row += 1
		}

		gridManager.endHole()

		pixiApp.stage.addChild(gridManager)
	}

	/**
	 * Draw an image to the shadow canvas.
	 *
	 * @param {object} config Configuration for the draw operation.
	 * @param {HTMLImageElement} config.image The source image to be drawn.
	 * @param {object} config.source Configuration for the source image.
	 * @param {number} config.source.height The height of the section of the source image to be rendered.
	 * @param {number} config.source.width The width of the section of the source image to be rendered.
	 * @param {number} config.source.x The left most position of the section of the source image to be rendered.
	 * @param {number} config.source.y The top most position of the section of the source image to be rendered.
	 * @param {object} config.destination Configuration for the drawing destination.
	 * @param {number} config.destination.height The height of the image to be rendered to the shadow canvas.
	 * @param {number} config.destination.width The width of the image to be rendered to the shadow canvas.
	 * @param {number} config.destination.x The x position at which the image will be rendered.
	 * @param {number} config.destination.y The y position at which the image will be rendered.
	 * @param {Array} [config.options] Additional options to be passed when drawing the image.
	 */
	drawImage(config) {
		let destinationX = config.destination.x
		let destinationY = config.destination.y

		if (config.destination.cell) {
			destinationX = config.destination.cell.x * TILE_SIZE.width
			destinationY = config.destination.cell.y * TILE_SIZE.height
		}

		this.queue[this.layer].push([
			'drawImage',
			config.image,
			config.source.x,
			config.source.y,
			config.source.width,
			config.source.height,
			destinationX,
			destinationY,
			config.destination.width,
			config.destination.height,
			...(config.options || []),
		])
	}

	/**
	 * Draw a straight line to the shadow canvas.
	 *
	 * @param {object} config Configuration for the draw operation.
	 * @param {object} config.source Configuration for the source position of the line.
	 * @param {number} config.source.x The x position at of the start of the line.
	 * @param {number} config.source.y The y position at of the start of the line.
	 * @param {object} config.destination Configuration for the destination position of the line.
	 * @param {number} config.destination.x The x position at of the end of the line.
	 * @param {number} config.destination.y The y position at of the end of the line.
	 */
	drawLine(config) {
		this.queue[this.layer].push(['beginPath'])
		this.queue[this.layer].push([
			'moveTo',
			config.source.x,
			config.source.y,
		])
		this.queue[this.layer].push([
			'lineTo',
			config.destination.x,
			config.destination.y,
		])
		this.queue[this.layer].push(['stroke'])
	}

	/**
	 * Draw a path to the shadow canvas.
	 *
	 * @param {object} config Configuration for the draw operation.
	 * @param {object[]} config.points Path points.
	 */
	drawPath(config) {
		const { points } = config

		this.queue[this.layer].push(['beginPath'])

		points.forEach((point, index) => {
			const {
				x,
				y,
			} = point

			let operation = 'lineTo'

			if (index === 0) {
				operation = 'moveTo'
			}

			this.queue[this.layer].push([operation, x, y])
		})

		this.queue[this.layer].push(['stroke'])
	}

	/**
	 * Draw a rectangle to the shadow canvas.
	 *
	 * @param {object} config Configuration for the draw operation.
	 * @param {object} config.cell The coordinates of the target cell (alternative to setting x and y directly).
	 * @param {number} config.cell.x Target cell x coordinate.
	 * @param {number} config.cell.y Target cell y coordinate.
	 * @param {number} config.height Height of the rectangle to be drawn.
	 * @param {'fill' | 'stroke'} [config.mode = 'fill'] Whether the rectangle will be drawn with a stroke or a fill.
	 * @param {Array} config.options Additional options to be passed to the draw operation.
	 * @param {number} config.width Height of the rectangle to be drawn.
	 * @param {number} config.x The left most position of the rectangle.
	 * @param {number} config.y The right most position of the rectangle.
	 */
	drawRectangle(config) {
		let destinationX = config.x
		let destinationY = config.y

		if (config.cell) {
			destinationX = config.cell.x * TILE_SIZE.width
			destinationY = config.cell.y * TILE_SIZE.height
		}

		this.queue[this.layer].push([
			`${config.mode || 'fill'}Rect`,
			destinationX,
			destinationY,
			config.width,
			config.height,
			...(config.options ?? []),
		])
	}

	/**
	 * Initialise the renderer.
	 */
	async initialise() {
		// // Render pixel art properly.
		// BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST

		// // Set options for pixi-tilemap.
		// settings.TEXTILE_UNITS = 4
		// settings.TEXTURES_PER_TILEMAP = 4
		// settings.use32bitIndex = true

		// const pixiApp = new Application({
		// 	antialias: false,
		// 	autoDensity: true,
		// 	autoStart: false,
		// 	backgroundAlpha: 0,
		// 	resolution: window.devicePixelRatio || 1,
		// })

		// store.state.pixiApp = pixiApp

		// // Scale the stage up 4x.
		// pixiApp.stage.setTransform(
		// 	0,
		// 	0,
		// 	this.uiScale,
		// 	this.uiScale,
		// 	0,
		// 	0,
		// 	0,
		// 	0,
		// 	0,
		// )

		// // const spritesheet = new Spritesheet()

		// // await spritesheet.parse()

		// this.drawGrid()
	}

	/**
	 * Start the resize observer. The resize observer will watch the main canvas's parent element, resizing the renderer when necessary.
	 */
	initialiseResizeObserver() {
		this.resizeObserver = new ResizeObserver(() => {
			this.needsResize = true
		})

		this.resizeObserver.observe(this.target.canvas.parentElement)
	}

	/**
	 * Draw the contents of the shadow canvas to the main canvas.
	 */
	refresh() {
		const shadow = this.shadow
		const target = this.target

		target.canvas.height = shadow.canvas.height
		target.canvas.width = shadow.canvas.width
		target.clearRect(0, 0, 0xffff, 0xffff)
		target.drawImage(shadow.canvas, 0, 0)
	}

	/**
	 * Restore the transform of the main canvas with respect to the current pixel size. Useful after using `renderer.setTranslate()`.
	 */
	resetTransform() {
		const { globalOffset } = store.state
		this.queue[this.layer].push([
			'setTransform',
			this.pixelSize,
			0,
			0,
			this.pixelSize,
			globalOffset.x,
			globalOffset.y,
		])
	}

	/**
	 * Resize and update the scale of the main canvas.
	 */
	resize() {
		const { isRunning } = store.state

		if (this.needsResize && isRunning) {
			const height = this.target.canvas.parentNode.offsetHeight
			const width = this.target.canvas.parentNode.offsetWidth

			const shadowCanvas = this.shadow.canvas
			const targetCanvas = this.target.canvas

			this.height = height
			this.width = width
			this.pixelSize = this.uiScale * this.resolution

			// Set display size
			targetCanvas.style.height = `${height}px`
			targetCanvas.style.width = `${width}px`

			// Set actual size
			targetCanvas.height = Math.floor(height * this.resolution)
			targetCanvas.width = Math.floor(width * this.resolution)
			shadowCanvas.height = Math.floor(height * this.resolution)
			shadowCanvas.width = Math.floor(width * this.resolution)

			// Normalise coordinates
			this.target.scale(this.pixelSize, this.pixelSize)
			this.shadow.scale(this.pixelSize, this.pixelSize)

			this.needsResize = false
		}
	}

	/**
	 * Set the alpha value for draw operations.
	 *
	 * @param {number} alpha Alpha value; must be a decimal between 0 and 1.
	 */
	setAlpha(alpha) {
		this.queue[this.layer].push([
			'alpha',
			alpha,
		])
	}

	/**
	 * Set stroke and fill colors for draw operations.
	 *
	 * @param {string} [stroke = 'black'] Stroke color to be set.
	 * @param {string} [fill = 'black'] Fill color to be set.
	 */
	setColor(stroke = 'black', fill = 'black') {
		this.queue[this.layer].push([
			'color',
			stroke,
			fill,
		])
	}

	/**
	 * Sets the line cap style for draw operations.
	 *
	 * @param {'butt' | 'round' | 'square'} lineCapStyle The line cap style to be set.
	 */
	setLineCap(lineCapStyle) {
		this.queue[this.layer].push(['lineCap', lineCapStyle])
	}

	/**
	 * Sets the line dash style for draw operations.
	 *
	 * @param {number[]} lineDashStyle The line dash style to be set.
	 */
	setLineDash(lineDashStyle) {
		this.queue[this.layer].push(['setLineDash', lineDashStyle])
	}

	/**
	 * Sets the width of lines for draw operations.
	 *
	 * @param {number} width The width (in pixels) to be set.
	 */
	setLineWidth(width) {
		this.queue[this.layer].push(['lineWidth', width])
	}

	/**
	 * Translate the anchor point for draw operations. Useful for shifting to a relative position before performing a large number of draw operations.
	 *
	 * @param {number} x The number of pixels to shift the canvas horizontally.
	 * @param {number} y The number of pixels to shift the canvas vertically.
	 */
	setTranslate(x, y) {
		this.queue[this.layer].push([
			'translate',
			x,
			y,
		])
	}

	/**
	 * Perform all draw operations from the queue on the shadow canvas, then copy those changes to the main canvas.
	 */
	update() {
		this.resize()

		const renderQueue = this.queue.flat()
		const context = this.shadow

		const { globalOffset } = store.state

		// Clear the canvas
		context.clearRect(
			-globalOffset.x,
			-globalOffset.y,
			this.width + globalOffset.x,
			this.height + globalOffset.y,
		)

		// Disable anti-aliasing
		context.imageSmoothingEnabled = false

		// Reset the transform
		context.setTransform(this.pixelSize, 0, 0, this.pixelSize, globalOffset.x, globalOffset.y)

		for (const task of renderQueue) {
			const [call] = task
			switch (call) {
				case 'alpha':
					context.globalAlpha = task[1]
					break

				case 'color':
					context.strokeStyle = task[1]
					context.fillStyle = task[2]
					break

				case 'lineCap':
				case 'lineWidth':
					context[call] = task[1]
					break

				default:
					context[call](...task.slice(1))
					break
			}
		}

		this.refresh()
		this.queue = [[], [], []]
	}





	/****************************************************************************\
	 * Public getters
	\****************************************************************************/

	/** @returns {string} The current grid color. */
	get gridColor() {
		const { pixiApp } = store.state
		const canvas = pixiApp.view
		return getComputedStyle(canvas).getPropertyValue('--palette-purple-hex')
	}

	get height() {
		const { pixiApp } = store.state
		return pixiApp.screen.height
	}

	/** @returns {number} The pixel density of the current screen. */
	get resolution() {
		return window.devicePixelRatio || 1
	}

	/** @returns {number} The current UI scale. */
	get uiScale() {
		const { pixiApp } = store.state
		const canvas = pixiApp.view
		return Number(getComputedStyle(canvas).getPropertyValue('--ui-scale'))
	}

	get width() {
		const { pixiApp } = store.state
		return pixiApp.screen.width
	}
}
