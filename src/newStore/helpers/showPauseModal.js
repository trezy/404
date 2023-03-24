// Local imports
import { store } from '../store.js'





/**
 * Shows the pause modal.
 */
export const showPauseModal = () => {
	store.set(() => ({ isPauseModalVisible: true }))
}
