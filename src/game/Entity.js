// Local imports
import { Renderer } from './Renderer.js'
import { TILE_SIZE } from './Tile.js'





// Constants
const ANIMATION_FRAME_COUNTS = {
	idle: 1,

	push: 4,

	walk: 4,
}





/**
 * Represents a controllable or interactive entity in the game.
 */
export class Entity {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#frame = 0

	/** @type {'down' | 'left' | 'right' | 'up'} */
	#direction = 'right'

	#frameRate = 10

	#isAnimated = false

	#lastFrameUpdate = 0

	#position = {
		x: 0,
		y: 0,
	}

	/** @type {'idle' | 'push' | 'walk'} */
	#state = 'idle'





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Create a new Entity.
	 *
	 * @param {object} config Configuration for the new entity.
	 * @param {'down' | 'left' | 'right' | 'up'} [config.direction = 'right'] The direction this entity is currently pointing.
	 * @param {number} [config.frameRate = 15] The rate at which to update the frame being rendered for animated entities.
	 * @param {boolean} [config.isAnimated = false] Whether or not this entity is animated.
	 * @param {object} [config.position] The grid cell at which this entity should be rendered.
	 */
	constructor(config) {
		const {
			direction,
			frameRate,
			isAnimated,
			position,
		} = config

		if (direction) {
			this.#direction = direction
		}

		if (frameRate) {
			this.#frameRate = frameRate
		}

		if (isAnimated) {
			this.#isAnimated = isAnimated
		}

		if (position) {
			this.#position = position
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Render the current frame of this entity to the canvas.
	 *
	 * @param {Renderer} renderer The renderer to be used for drawing the entity.
	 * @param {HTMLImageElement} tileset The tileset from which to pull the entity's images.
	 */
	render(renderer, tileset) {
		const now = performance.now()

		const frameCount = ANIMATION_FRAME_COUNTS[this.#state]

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
		switch (this.#state) {
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
				y: this.#position.y * TILE_SIZE.width,
			},
		})
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
	 * @returns {object} Whether or not this entity is animated.
	 */
	get position() {
		return this.#position
	}

	/**
	 * @returns {'idle' | 'push' | 'walk'} The current animation state.
	 */
	get state() {
		return this.#state
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
}
