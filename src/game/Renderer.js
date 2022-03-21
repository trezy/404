// Local imports
import { TILE_SIZE } from './Tile.js'





// Constants
export const LAYERS = {
	background: 0,
	foreground: 1,
	sprites: 2,
}





/**
 * A renderer to control canvas operations.
 */
export class Renderer {
	/****************************************************************************\
	 * Instance properties
	\****************************************************************************/

	height = 0

	layer = LAYERS.background

	pixelSize = 1

	queue = [
		[], // background
		[], // foreground
		[], // sprites
	]

	resizeObserver = null

	shadow = null

	target = null

	width = 0





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Resize and update the scale of the main canvas.
	 *
	 * @param {object} config Configuration for the resizing operation.
	 * @param {number} config.height The height that the canvas should be resized to.
	 * @param {number} config.width The width that the canvas should be resized to.
	 */
	resize = config => {
		const {
			height,
			width,
		} = config

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
	}

	/**
	 * Create a new renderer.
	 */
	constructor() {
		const canvas = document.querySelector('#game-canvas')

		this.target = canvas.getContext('2d')
		this.shadow = canvas.cloneNode().getContext('2d')

		this.initialiseResizeObserver()
	}

	/**
	 * Draw the background grid to the shadow canvas.
	 *
	 * @param {number} mapWidth The width of the map that will be rendered on top of the grid.
	 * @param {number} mapHeight The height of the map that will be rendered on top of the grid.
	 */
	drawGrid(mapWidth, mapHeight) {
		this.layer = LAYERS.background

		const computedStyles = getComputedStyle(this.target.canvas)
		const gridColor = computedStyles.getPropertyValue('--palette-purple')

		const renderHeight = Math.max(
			Math.ceil(this.height / TILE_SIZE.height) + 2,
			mapHeight,
		)
		const renderWidth = Math.max(
			Math.ceil(this.width / TILE_SIZE.width) + 2,
			mapWidth,
		)

		let column = 0
		let row = 0

		this.setAlpha(0.1)

		while (row <= renderHeight) {
			const y = (TILE_SIZE.height * row) + 0.5
			this.setColor(gridColor, 'transparent')
			this.drawLine({
				source: {
					x: 0,
					y,
				},
				destination: {
					x: this.width,
					y,
				}
			})
			row += 1
		}

		while (column <= renderWidth) {
			const x = (TILE_SIZE.width * column) + 0.5
			this.setColor(gridColor, 'transparent')
			this.drawLine({
				source: {
					x,
					y: 0,
				},
				destination: {
					x,
					y: this.height,
				}
			})
			column += 1
		}

		this.setAlpha(1)
	}

	/**
	 * Draw an image to the shadow canvas.
	 *
	 * @param {object} config Configuration for the draw operation.
	 * @param {Image} config.image The source image to be drawn.
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
		const {
			image,
			source: {
				height: sourceHeight,
				width: sourceWidth,
				x: sourceX,
				y: sourceY,
			},
			destination: {
				height: destinationHeight,
				width: destinationWidth,
				x: destinationX,
				y: destinationY,
			},
			options = [],
		} = config

		this.queue[this.layer].push([
			'drawImage',
			image,
			sourceX,
			sourceY,
			sourceWidth,
			sourceHeight,
			destinationX,
			destinationY,
			destinationWidth,
			destinationHeight,
			...options,
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
		const {
			source: {
				x: sourceX,
				y: sourceY,
			},
			destination: {
				x: destinationX,
				y: destinationY,
			}
		} = config

		this.queue[this.layer].push(['beginPath'])
		this.queue[this.layer].push(['moveTo', sourceX, sourceY])
		this.queue[this.layer].push(['lineTo', destinationX, destinationY])
		this.queue[this.layer].push(['stroke'])
	}

	/**
	 * Draw a rectangle to the shadow canvas.
	 *
	 * @param {object} config Configuration for the draw operation.
	 * @param {number} config.height Height of the rectangle to be drawn.
	 * @param {'fill' | 'stroke'} [config.mode = 'fill'] Whether the rectangle will be drawn with a stroke or a fill.
	 * @param {Array} config.options Additional options to be passed to the draw operation.
	 * @param {number} config.width Height of the rectangle to be drawn.
	 * @param {number} config.x The left most position of the rectangle.
	 * @param {number} config.y The right most position of the rectangle.
	 */
	drawRectangle(config) {
		const {
			height,
			mode = 'fill',
			options = [],
			width,
			x,
			y,
		} = config

		this.queue[this.layer].push([`${mode}Rect`, x, y, width, height, ...options])
	}

	/**
	 * Start the resize observer. The resize observer will watch the main canvas's parent element, resizing the renderer when necessary.
	 */
	initialiseResizeObserver() {
		this.resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				const parentHeight = entry.target.offsetHeight
				const parentWidth = entry.target.offsetWidth

				const canvasHeight = this.target.offsetHeight
				const canvasWidth = this.target.offsetWidth

				if ((canvasHeight !== parentHeight) || (canvasWidth !== parentWidth)) {
					this.resize({
						height: parentHeight,
						width: parentWidth,
					})
				}
			}
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
		this.queue[this.layer].push(['setTransform', this.pixelSize, 0, 0, this.pixelSize, 0, 0])
	}

	/**
	 * Set the alpha value for draw operations.
	 *
	 * @param {number} alpha Alpha value; must be a decimal between 0 and 1.
	 */
	setAlpha(alpha) {
		this.queue[this.layer].push(['alpha', alpha])
	}

	/**
	 * Set stroke and fill colors for draw operations.
	 *
	 * @param {string} [stroke = 'black'] Stroke color to be set.
	 * @param {string} [fill = 'black'] Fill color to be set.
	 */
	setColor(stroke = 'black', fill = 'black') {
		this.queue[this.layer].push(['color', stroke, fill])
	}

	/**
	 * Translate the anchor point for draw operations. Useful for shifting to a relative position before performing a large number of draw operations.
	 *
	 * @param {number} x The number of pixels to shift the canvas horizontally.
	 * @param {number} y The number of pixels to shift the canvas vertically.
	 */
	setTranslate(x, y) {
		this.queue[this.layer].push(['translate', x, y])
	}

	/**
	 * Perform all draw operations from the queue on the shadow canvas, then copy those changes to the main canvas.
	 */
	update() {
		const renderQueue = this.queue.flat()
		const context = this.shadow

		// Disable anti-aliasing
		context.imageSmoothingEnabled = false

		// Clear the canvas
		context.clearRect(0, 0, 0xffff, 0xffff)

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

				case 'lineWidth':
					context.lineWidth = task[1]
					break

				default:
					context[call](task.slice(1))
					break
			}
		}

		this.refresh()
		this.queue = [[], [], []]
	}





	/****************************************************************************\
	 * Public getters
	\****************************************************************************/

	/**
	 * Retrieves the screen's pixel density.
	 *
	 * @returns {number} The pixel density of the current screen.
	 */
	get resolution() {
		return window.devicePixelRatio || 1
	}

	/**
	 * Retrieves the game's UI scale.
	 *
	 * @returns {number} The current UI scale.
	 */
	get uiScale() {
		return Number(getComputedStyle(this.target.canvas).getPropertyValue('--ui-scale'))
	}
}
