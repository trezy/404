// Module imports
import { aStar } from 'ngraph.path'





// Local imports
import { store } from '../../newStore/store.js'
import { Vector2 } from '../structures/Vector2.js'





/** Handles pathfinding for the robot. */
export function pathfindingSystem() {
	const {
		currentDestination,
		map,
		now,
		robot,
		timerGracePeriod,
		timerPathfindingStartedAt,
		timerStartedAt,
	} = store.state

	if (!timerPathfindingStartedAt) {
		if (now > (timerStartedAt + timerGracePeriod)) {
			store.set(() => ({ timerPathfindingStartedAt: now }))
		} else {
			return
		}
	}

	if (!currentDestination || Vector2.areEqual(robot.position, currentDestination)) {
		const newDestination = map.destinations.reduce((accumulator, destination) => {
			const magnitude = Vector2.magnitude(robot.position, destination)

			if ((accumulator === null) || (accumulator > magnitude)) {
				return destination
			}

			return accumulator
		}, null)

		const newPath = aStar(map.graph)
			.find(
				newDestination.toString(),
				robot.position.toString(),
			)
			.map(node => node.data.position)

		store.set(() => ({
			currentDestination: newDestination,
			currentPath: newPath,
		}))
	}
}
