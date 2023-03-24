// Local imports
import { store } from '../store.js'





/**
 * Shows the pause modal.
 */
export const hidePauseModal = () => {
	store.set(() => ({ isPauseModalVisible: false }))
}
