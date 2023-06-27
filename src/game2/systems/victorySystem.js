// Local imports
import { store } from '../../newStore/store.js'
import { Vector2 } from '../structures/Vector2.js'





/** Tests the game state to determine if the robot has reached a destination. */
export function victorySystem() {
	const {
		map,
		now,
		robot,
	} = store.state

	const hasSucceeded = map.destinations.some(destination => {
		return Vector2.areEqual(robot.position, destination)
	})

	if (hasSucceeded) {
		store.set({
			isVictorious: true,
			timerStoppedAt: now,
		})
	}
}
