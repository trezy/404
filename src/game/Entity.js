// Local imports
import { MapManager } from './MapManager.js'
import { Renderer } from './Renderer.js'
import { store } from '../newStore/store.js'
import { TILE_SIZE } from './Tile.js'





// Constants
const ANALYSIS_PATH_SEGMENT_DURATION = 300
const ANIMATION_FRAME_COUNTS = {
	idle: 1,

	push: 4,

	walk: 4,
}
const PATHFINDING_STAGES = {
	ANALYSE: 1,
	EXECUTE: 2,
	WAIT: 3,
}





/**
 * Represents a controllable or interactive entity in the game.
 */
export class Entity {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#analysisDuration = 0

	#destination = null

	/** @type {'down' | 'left' | 'right' | 'up'} */
	#direction = 'right'

	#frame = 0

	#frameRate = 8

	#isAnimated = false

	#lastFrameUpdate = 0

	#mapManager = null

	#path = null

	#pathfindingStage = PATHFINDING_STAGES.ANALYSE

	#position = {
		x: 0,
		y: 0,
	}

	#speed = 0.4





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Create a new Entity.
	 *
	 * @param {object} config Configuration for the new entity.
	 * @param {'down' | 'left' | 'right' | 'up'} [config.direction = 'right'] The direction this entity is currently pointing.
	 * @param {number} [config.frameRate = 8] The rate at which to update the frame being rendered for animated entities.
	 * @param {boolean} [config.isAnimated = false] Whether or not this entity is animated.
	 * @param {MapManager} config.mapManager The `MapManager` to use for pathfinding.
	 * @param {object} config.position The grid cell at which this entity should be rendered.
	 */
	constructor(config) {
		const {
			direction,
			frameRate,
			isAnimated,
			mapManager,
			position,
		} = config

		if (!mapManager) {
			throw new Error('Entities must be created with an instance of a `MapManager`.')
		}

		if (!position) {
			throw new Error('Entities must be created with an initial position.')
		}

		this.#mapManager = mapManager
		this.#position = position

		if (direction) {
			this.#direction = direction
		}

		if (frameRate) {
			this.#frameRate = frameRate
		}

		if (isAnimated) {
			this.#isAnimated = isAnimated
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	#getRandomNearbyTile() {
		const paths = [
			this.#mapManager.findPath(
				this.#position.x,
				this.#position.y,
				Math.min(this.#position.x + 1, this.#mapManager.width),
				this.#position.y,
			),
			this.#mapManager.findPath(
				this.#position.x,
				this.#position.y,
				Math.max(this.#position.x - 1, 0),
				this.#position.y,
			),
			this.#mapManager.findPath(
				this.#position.x,
				this.#position.y,
				this.#position.x,
				Math.min(this.#position.y + 1, this.#mapManager.height),
			),
			this.#mapManager.findPath(
				this.#position.x,
				this.#position.y,
				this.#position.x,
				Math.max(this.#position.y - 1, 0),
			),
		]

		const viablePaths = paths.filter(path => path?.length)

		const selectedPathIndex = Math.floor(Math.random() * viablePaths.length)
		const selectedPath = viablePaths[selectedPathIndex]

		return selectedPath
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Determines the next step in the current best path to an exit.
	 */
	findNextDestination() {
		const possiblePaths = this
			.#mapManager
			.destinations
			.map(destination => {
				return this.#mapManager.findPath(
					this.#position.x,
					this.#position.y,
					destination.x,
					destination.y,
				)
			})
			.filter(path => path.length)
			.sort((pathA, pathB) => {
				if (pathA.length > pathB.length) {
					return 1
				}

				if (pathA.length < pathB.length) {
					return -1
				}

				return 0
			})

		this.#path = possiblePaths[0]

		if (!this.#path?.length) {
			this.#path = this.#getRandomNearbyTile()
		}

		this.#destination = this.#path?.pop()
		this.#pathfindingStage = PATHFINDING_STAGES.ANALYSE
	}

	/**
	 * Render the current frame of this entity to the canvas.
	 *
	 * @param {Renderer} renderer The renderer to be used for drawing the entity.
	 * @param {HTMLImageElement} tileset The tileset from which to pull the entity's images.
	 */
	render(renderer, tileset) {
		const now = performance.now()

		/**
		 * Draw the pathfinding analysis indicator.
		 */
		if (this.#path?.length && (this.#pathfindingStage === PATHFINDING_STAGES.ANALYSE)) {
			const points = this.#path
				.map(node => {
					const {
						height,
						width,
						x,
						y,
					} = node.data

					return {
						x: (x * width) + (width / 2),
						y: (y * height) + (height / 2),
					}
				})

			points.push({
				x: (this.#position.x * TILE_SIZE.width) + (TILE_SIZE.width / 2),
				y: (this.#position.y * TILE_SIZE.height) + (TILE_SIZE.height / 2),
			})
			points.reverse()

			const totalDuration = this.#path.length * ANALYSIS_PATH_SEGMENT_DURATION
			const analysisCompletionPercentage = this.#analysisDuration / totalDuration

			const lineLength = points.length * TILE_SIZE.width

			const lineDashLength = Math.round(analysisCompletionPercentage * lineLength)
			const lineGapLength = lineLength - lineDashLength

			renderer.setAlpha(0.5)
			renderer.setColor('blue')
			renderer.setLineCap('round')
			renderer.setLineDash([lineDashLength, lineGapLength])
			renderer.setLineWidth(4)
			renderer.drawPath({ points })
			renderer.setAlpha(1)
			renderer.setColor('black')
			renderer.setLineCap('butt')
			renderer.setLineDash([])
			renderer.setLineWidth(1)
		}

		const frameCount = ANIMATION_FRAME_COUNTS[this.state]

		if (this.isAnimated) {
			const frameUpdateDelta = now - this.#lastFrameUpdate

			if (frameUpdateDelta >= this.#millisecondsPerFrame) {
				this.#lastFrameUpdate = now
				this.#frame += 1

				if (this.#frame >= frameCount) {
					this.#frame = 0
				}
			}
		}

		const sourcePosition = {
			x: 304,
			y: 16,
		}

		// eslint-disable-next-line default-case
		switch (this.#direction) {
			case 'right':
				sourcePosition.y += 32
				break

			case 'up':
				sourcePosition.y += 64
				break

			case 'left':
				sourcePosition.y += 96
				break
		}

		// eslint-disable-next-line default-case
		switch (this.state) {
			case 'push':
				sourcePosition.x += 112
				break

			case 'walk':
				sourcePosition.x += 32
				break
		}

		sourcePosition.x += this.#frame * 16

		renderer.drawImage({
			image: tileset,
			source: {
				height: TILE_SIZE.height,
				width: TILE_SIZE.width,
				...sourcePosition,
			},
			destination: {
				height: TILE_SIZE.height,
				width: TILE_SIZE.width,
				x: this.#position.x * TILE_SIZE.width,
				y: (this.#position.y * TILE_SIZE.height) - 2,
			},
		})
	}

	/**
	 * Updates the entity's position and path.
	 */
	update() {
		const { timeDelta } = store.state

		if (!this.#destination) {
			this.findNextDestination()
		}

		if (this.#pathfindingStage === PATHFINDING_STAGES.ANALYSE) {
			const totalDuration = this.#path.length * ANALYSIS_PATH_SEGMENT_DURATION

			this.#analysisDuration += timeDelta

			if (this.#analysisDuration >= totalDuration) {
				this.#pathfindingStage = PATHFINDING_STAGES.EXECUTE
				this.#analysisDuration = 0
			}
		} else if (this.#pathfindingStage === PATHFINDING_STAGES.EXECUTE) {
			const xSpeed = this.#speed / TILE_SIZE.width
			const ySpeed = this.#speed / TILE_SIZE.height

			if (this.#position.x > this.#destination.data.x) {
				this.#position.x = Math.max(this.#position.x - xSpeed, this.#destination.data.x)
				this.#direction = 'left'
			} else if (this.#position.x < this.#destination.data.x) {
				this.#position.x = Math.min(this.#position.x + xSpeed, this.#destination.data.x)
				this.#direction = 'right'
			} else if (this.#position.y > this.#destination.data.y) {
				this.#position.y = Math.max(this.#position.y - ySpeed, this.#destination.data.y)
				this.#direction = 'up'
			} else if (this.#position.y < this.#destination.data.y) {
				this.#position.y = Math.min(this.#position.y + ySpeed, this.#destination.data.y)
				this.#direction = 'down'
			} else if (this.#path?.length) {
				this.#destination = this.#path.pop()
			} else {
				this.#destination = null
				this.#path = null
			}
		}
	}





	/****************************************************************************\
	 * Private instance getters
	\****************************************************************************/

	/**
	 * Calculates how many milliseconds should pass before updating to the next frame of the animation.
	 *
	 * @returns {number} The number of milliseconds per frame.
	 */
	get #millisecondsPerFrame() {
		return Math.floor((1 / this.frameRate) * 1000)
	}





	/****************************************************************************\
	 * Public instance getters
	\****************************************************************************/

	/**
	 * @returns {number} The current animation frame.
	 */
	get frame() {
		return this.#frame
	}

	/**
	 * @returns {'down' | 'left' | 'right' | 'up'} The direction this entity is currently pointing.
	 */
	get direction() {
		return this.#direction
	}

	/**
	 * @returns {number} The configured frame rate.
	 */
	get frameRate() {
		return this.#frameRate
	}

	/**
	 * @returns {boolean} Whether or not this entity is animated.
	 */
	get isAnimated() {
		return this.#isAnimated
	}

	/**
	 * @returns {import('./Tile.js').Vector2} The path the entity is travelling.
	 */
	get path() {
		return this.#path
	}

	/**
	 * @returns {import('./Tile.js').Vector2} This entity's current position.
	 */
	get position() {
		return this.#position
	}

	/**
	 * @returns {'idle' | 'push' | 'walk'} The current animation state.
	 */
	get state() {
		if (this.#pathfindingStage === PATHFINDING_STAGES.EXECUTE) {
			return 'walk'
		}

		return 'idle'
	}
}
