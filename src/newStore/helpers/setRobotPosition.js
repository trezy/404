// Local imports
import { store } from '../store.js'





/**
 * Sets the robot's position.
 *
 * @param {object} newPosition A vector object.
 * @param {number} newPosition.x The robot's horizontal position.
 * @param {number} newPosition.y The robot's vertical position.
 */
export function setRobotPosition(newPosition, ) {
	let {
		x,
		y,
	} = newPosition

	store.set(() => ({
		playerPositionX: x,
		playerPositionY: y,
	}))
}
