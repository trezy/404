// Local imports
import { store } from '../store.js'





export const skipGracePeriod = () => {
	const {
		now,
		timerPathfindingStartedAt,
	} = store.state

	if (timerPathfindingStartedAt) {
		return
	}

	store.set(() => ({ timerPathfindingStartedAt: now }))
}
