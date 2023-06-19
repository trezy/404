// Module imports
import {
	AnimatedSprite,
	Assets,
} from 'pixi.js'

// Local imports
import { store } from '../store.js'





/**
 * Updates the current sprite/animation.
 *
 * @param {string} animationName The name of the animation to update to.
 * @returns {boolean} Whether the animation was updated successfully.
 */
export function setRobotAnimation(animationName) {
	const {
		robotSprite,
		spriteCache,
		viewport,
	} = store.state

	if (!spriteCache[animationName]) {
		const spritesheet = Assets.get('global-spritesheet')
		spriteCache[animationName] = new AnimatedSprite(spritesheet.animations[`robot-0-${animationName}`])
		spriteCache[animationName].name = 'player'
	}

	const sprite = spriteCache[animationName]

	if (sprite === robotSprite) {
		return true
	}

	sprite.animationSpeed = 0.1666
	sprite.play()

	if (robotSprite) {
		robotSprite.gotoAndStop(0)
		viewport.removeChild(robotSprite)
	}

	viewport.addChildAt(sprite, 2)

	store.set(() => ({ robotSprite: sprite }))

	return true
}
