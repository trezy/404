// Local imports
import { store } from '../../newStore/store.js'





/** Manages game timing. */
export function timeSystem() {
	const now = performance.now()

	const { timerStoppedAt } = store.state

	if (timerStoppedAt) {
		return
	}

	store.set(previousState => {
		const patch = { now }

		if (!previousState.timerStartedAt) {
			patch.timerStartedAt = now
		}

		const timerDelta = now - (patch.timerStartedAt ?? previousState.timerStartedAt)

		if (!previousState.timerPathfindingStartedAt && ((previousState.timerGracePeriod - timerDelta) >= 0)) {
			const delta = previousState.timerGracePeriod - timerDelta
			const deltaInSeconds = delta / 1000

			const minutes = Math.floor(deltaInSeconds / 60)
			const seconds = Math.ceil(deltaInSeconds % 60)

			const minutesString = String(minutes).padStart(2, '0')
			const secondsString = String(seconds).padStart(2, '0')

			patch.timerString = `-${minutesString}:${secondsString}`
		} else  {
			const delta = now - previousState.timerPathfindingStartedAt
			const deltaInSeconds = delta / 1000

			const minutes = Math.floor(deltaInSeconds / 60)
			const seconds = Math.floor(deltaInSeconds % 60)

			const minutesString = String(minutes).padStart(2, '0')
			const secondsString = String(seconds).padStart(2, '0')

			patch.timerString = `${minutesString}:${secondsString}`
		}

		return patch
	})
}
