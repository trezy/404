// Local imports
import { store } from '../../newStore/store.js'
import { TILE_SIZE } from '../../game/Tile.js'
import { Vector2 } from '../structures/Vector2.js'





/** Moves the robot. */
export function moveSystem() {
	const {
		currentPath,
		robot,
	} = store.state

	if (!currentPath) {
		return
	}

	if (!currentPath.length) {
		store.set(() => ({ currentPath: null }))
		return
	}

	let path = currentPath
	let nextPathSegment = path[0]

	if (Vector2.areEqual(robot.cellPosition, nextPathSegment)) {
		path = [...currentPath]
		path.shift()
		nextPathSegment = path[0]

		if (!nextPathSegment) {
			store.set(() => ({ currentPath: null }))
			return
		} else {
			store.set(() => ({ currentPath: path }))
		}
	}

	const travelDirection = Vector2.subtract(nextPathSegment, robot.cellPosition)
	const travelDistance = new Vector2(
		travelDirection.x * robot.speed,
		travelDirection.y * robot.speed,
	)
	const newPosition = Vector2.add(robot.position, travelDistance)

	robot.position = newPosition
}
