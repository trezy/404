// Module imports
import { useStore } from 'statery'




// Local imports
import { ExportModal } from './ExportModal/ExportModal.jsx'
import { store } from './store.js'
import { LoadMapModal } from './LoadMapModal/LoadMapModal.jsx'
import { ManageResourcePacksModal } from './ManageResourcePacksModal/ManageResourcePacksModal.jsx'





/**
 * Renders the map editor.
 */
export function Modals() {
	const {
		isExportMapModalVisible,
		isLoadMapModalVisible,
		isManageResourcepacksModalVisible,
	} = useStore(store)

	return (
		<>
			{isExportMapModalVisible && (
				<ExportModal />
			)}

			{isLoadMapModalVisible && (
				<LoadMapModal />
			)}

			{isManageResourcepacksModalVisible && (
				<ManageResourcePacksModal />
			)}
		</>
	)
}
