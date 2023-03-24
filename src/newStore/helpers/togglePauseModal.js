// Local imports
import { store } from '../store.js'





/**
 * Shows the pause modal.
 */
export const togglePauseModal = () => {
	store.set(previousState => {
		console.log('togglePauseModal', {
			currentState: !previousState.isPauseModalVisible,
			previousState: previousState.isPauseModalVisible,
		})
		return { isPauseModalVisible: !previousState.isPauseModalVisible }
	})
}
