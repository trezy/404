// Local imports
import { store } from '../store.js'





export const skipGracePeriod = () => {
	store.set(previousState => ({ timerPathfindingStartedAt: previousState.now }))
}
