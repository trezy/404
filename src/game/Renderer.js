// Local imports
import {
	TILE_RENDERERS,
	TILE_SIZE,
} from './Tile.js'





// Constants
export const LAYERS = {
	background: 0,
	foreground: 1,
	sprites: 2,
}





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

	constructor() {
		const canvas = document.querySelector('#game-canvas')

		this.target = canvas.getContext('2d')
		this.shadow = canvas.cloneNode().getContext('2d')

		this.initialiseResizeObserver()
	}

	drawGrid(width, height) {
		this.layer = LAYERS.background

		const computedStyles = getComputedStyle(this.target.canvas)
		const gridColor = computedStyles.getPropertyValue('--palette-purple')

		const renderHeight = Math.max(
			Math.ceil(this.height / TILE_SIZE.height) + 2,
			height,
		)
		const renderWidth = Math.max(
			Math.ceil(this.width / TILE_SIZE.width) + 2,
			width,
		)

		let column = 0
		let row = 0

		this.setAlpha(0.1)

		while (row <= renderHeight) {
			let y = (TILE_SIZE.height * row) + 0.5
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
			let x = (TILE_SIZE.width * column) + 0.5
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

	drawImage(config) {
		const {
			image,
			source: {
				x: sourceX,
				y: sourceY,
				width: sourceWidth,
				height: sourceHeight,
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

	refresh() {
		const shadow = this.shadow
		const target = this.target

		target.canvas.height = shadow.canvas.height
		target.canvas.width = shadow.canvas.width
		target.clearRect(0, 0, 0xffff, 0xffff)
		target.drawImage(shadow.canvas, 0, 0)
	}

	resetTransform() {
		this.queue[this.layer].push(['setTransform', this.pixelSize, 0, 0, this.pixelSize, 0, 0])
	}

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

	setAlpha(alpha) {
		this.queue[this.layer].push(['alpha', alpha])
	}

	setColor(stroke = 'black', fill = 'black') {
		this.queue[this.layer].push(['color', stroke, fill])
	}

	setTranslate(x, y) {
		this.queue[this.layer].push(['translate', x, y])
	}

	// Push all updates to screen
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
					[, context.globalAlpha] = task
					break

				case 'color':
					[, context.strokeStyle, context.fillStyle] = task
					break

				case 'lineWidth':
					[, context.lineWidth] = task
					break

				default:
					const [, ...args] = task
					context[call](...args)
					break
			}
		}

		this.refresh()
		this.queue = [[], [], []]
	}





	/****************************************************************************\
	 * Public getters
	\****************************************************************************/

	get aspectRatio() {
		return window.innerWidth / window.innerHeight
	}

	get resolution() {
		return window.devicePixelRatio || 1
	}

	get uiScale() {
		return Number(getComputedStyle(this.target.canvas).getPropertyValue('--ui-scale'))
	}
}
