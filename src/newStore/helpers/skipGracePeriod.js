// Local imports
import { store } from '../store.js'





export const skipGracePeriod = () => {
	store.state.timer.skipGracePeriod()
}
