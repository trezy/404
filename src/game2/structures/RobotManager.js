// Module imports
import {
	AnimatedSprite,
	Assets,
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

	/** @type {Vector2} */
	#position

	/** @type {number} */
	#speed = 0.02

	/** @type {import('pixi.js').Sprite} */
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
		this.position = config.position ?? new Vector2(0, 0)

		this.#updateSprite()
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	#updateSprite() {
		const {
			spriteCache,
			viewport,
		} = store.state

		const animationName = 'idle-east'

		if (!spriteCache[animationName]) {
			const spritesheet = Assets.get('global-spritesheet')
			spriteCache[animationName] = new AnimatedSprite(spritesheet.animations[`robot-0-${animationName}`])
			spriteCache[animationName].name = 'player'
		}

		const sprite = spriteCache[animationName]

		if (sprite !== this.#sprite) {
			sprite.animationSpeed = 0.1666
			sprite.play()

			if (this.#sprite) {
				this.#sprite.gotoAndStop(0)
				viewport.removeChild(this.#sprite)
			}

			this.#sprite = sprite

			viewport.addChildAt(this.#sprite, 2)
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
