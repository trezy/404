// Local imports
import { store } from '../store/index.js'





export class GameManager {
	/****************************************************************************\
	 * Private properties
	\****************************************************************************/

	#canvas = null





	/****************************************************************************\
	 * Public properties
	\****************************************************************************/

	controls = null
	cursorPosition = {
		x: 0,
		y: 0,
	}
	currentCell = null





	/****************************************************************************\
	 * Public methods
	\****************************************************************************/

	constructor() {
		// const system = new PlanetarySystem

		// this.canvas = document.querySelector('canvas')
		// this.canvas.style.display = 'none'
		// console.log(system)

		// this.currentCell = this.cluster.getRandomReachableCell()
		// this.cluster.populateGridCell(this.currentCell.x, this.currentCell.y)

		// setInterval(() => {
		// 	console.log(store.getState())
		// }, 1000)
	}

	gameLoop = () => {
		store
			.getState()
			.nextFrame()

		requestAnimationFrame(this.gameLoop)
	}

	// handleDoubleClick = () => {
	// 	if (document.fullscreenElement) {
	// 		document.exitFullscreen()
	// 	} else {
	// 		this.canvas.requestFullscreen()
	// 	}
	// }

	resizeCanvas = () => {
		// // Update the camera
		// this.camera.aspect = this.aspectRatio
		// this.camera.updateProjectionMatrix()

		// // Update the renderer
		// this.renderer.setSize(this.viewportWidth, this.viewportHeight)
		// this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	}

	start() {
		if (!store.getState().isRunning) {
			store.setState({ isRunning: true })

			window.addEventListener('resize', this.resizeCanvas)
			// window.addEventListener('dblclick', this.handleDoubleClick)

			this.resizeCanvas()
			this.gameLoop()
		}
	}





	/****************************************************************************\
	 * Public getters
	\****************************************************************************/

	get aspectRatio() {
		return this.viewportWidth / this.viewportHeight
	}

	get canvas() {
		if (!this.#canvas) {
			this.#canvas = document.querySelector('canvas')
		}

		return this.#canvas
	}

	get resolution() {
		return window.devicePixelRatio || 1
	}

	get viewportHeight() {
		return window.innerHeight
	}

	get viewportWidth() {
		return window.innerWidth
	}
}
