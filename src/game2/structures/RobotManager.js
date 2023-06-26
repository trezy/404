// Module imports
import {
	AnimatedSprite,
	Assets,
	Container,
} from 'pixi.js'





// Local imports
import { store } from '../../newStore/store.js'
import { TILE_SIZE } from '../../game/Tile.js'
import { Vector2 } from './Vector2.js'





// Types

/**
 * @typedef {object} RobotConfig
 * @property {Vector2} position The robot's current position.
 */





/**
 * Manages the robot's data.
 */
export class RobotManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {Vector2} */
	#cellPosition

	/** @type {'north' | 'south' | 'east' | 'west'} */
	#direction = 'east'

	/** @type {import('pixi.js').Container} */
	#offsetContainer

	/** @type {Vector2} */
	#position

	/** @type {number} */
	#speed = 0.02

	/** @type {import('pixi.js').Container} */
	#sprite

	/** @type {'idle' | 'walk' | 'push'} */
	#state = 'idle'





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new robot manager.
	 *
	 * @param {RobotConfig} config Initial configuration for the robot.
	 */
	constructor(config) {
		const { viewport } = store.state

		this.position = config.position ?? new Vector2(0, 0)

		this.#offsetContainer = new Container
		this.#sprite = new Container

		this.#offsetContainer.y = -2

		this.#sprite.name = 'player'
		this.#sprite.addChild(this.#offsetContainer)

		viewport.addChildAt(this.#sprite, 2)

		this.#updateSprite()
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	#updateSprite() {
		const { spriteCache } = store.state

		if (this.#sprite) {
			const pixelPosition = new Vector2(
				this.#position.x * 16,
				this.#position.y * 16,
			)
			const spritePosition = new Vector2(this.#sprite.x, this.#sprite.y)

			if (!Vector2.areEqual(pixelPosition, spritePosition)) {
				this.#state = 'walk'

				if (pixelPosition.x > spritePosition.x) {
					this.#direction = 'east'
				} else if (pixelPosition.x < spritePosition.x) {
					this.#direction = 'west'
				} else if (pixelPosition.y > spritePosition.y) {
					this.#direction = 'south'
				} else if (pixelPosition.y < spritePosition.y) {
					this.#direction = 'north'
				}
			} else {
				this.#state = 'idle'
			}
		}

		const animationName = `${this.#state}-${this.#direction}`

		if (!spriteCache[animationName]) {
			const spritesheet = Assets.get('global-spritesheet')
			spriteCache[animationName] = new AnimatedSprite(spritesheet.animations[`robot-0-${animationName}`])
		}

		const currentSprite = this.#offsetContainer.children[0]
		const newSprite = spriteCache[animationName]

		if (newSprite !== currentSprite) {
			newSprite.animationSpeed = 0.1666
			newSprite.play()

			if (currentSprite) {
				currentSprite.gotoAndStop(0)
				this.#offsetContainer.removeChild(currentSprite)
			}

			this.#offsetContainer.addChild(newSprite)
		}

		this.#sprite.x = Math.floor(this.#position.x * TILE_SIZE.width)
		this.#sprite.y = Math.floor(this.#position.y * TILE_SIZE.height)
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Updates the sprite based on state.
	 */
	update() {
		this.#updateSprite()
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/** @returns {Vector2} */
	get cellPosition() {
		return this.#cellPosition
	}

	/** @returns {Vector2} */
	get position() {
		return this.#position
	}

	/**
	 * Updates the robot's position.
	 *
	 * @param {Vector2} newPosition The new position.
	 */
	set position(newPosition) {
		if (!(newPosition instanceof Vector2)) {
			throw new TypeError('Robot position must be of type `Vector2`')
		}
		this.#position = newPosition
		this.#cellPosition = new Vector2(
			Math.floor(newPosition.x),
			Math.floor(newPosition.y),
		)
	}

	/** @return {number} */
	get speed() {
		return this.#speed
	}

	/** @returns {import('pixi.js').Sprite} */
	get sprite() {
		return this.#sprite
	}
}
