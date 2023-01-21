// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ExportModal } from '../ExportModal/ExportModal.jsx'
import { ManageResourcePacksModal } from '../ManageResourcePacksModal/ManageResourcePacksModal.jsx'
import { PanelContainer } from '../../PanelContainer/PanelContainer.jsx'
import { TilePalettePanel } from '../TilePalettePanel/TilePalettePanel.jsx'
import { useMapEditorContext } from '../Context/useMapEditorContext.js'





/**
 * Renders the left side of the map editor.
 */
export function LeftPanelContainer() {
	const {
		hasTiles,
		updateResourcepacks,
	} = useMapEditorContext()

	const leftPanels = useMemo(() => {
		return [
			TilePalettePanel,
		]
	}, [])

	const [showExportMapModal, setShowExportMapModal] = useState(false)
	const [showManageResourcePacksModal, setShowManageResourcePacksModal] = useState(false)

	const handleManageResourcePacksClick = useCallback(() => setShowManageResourcePacksModal(true), [setShowManageResourcePacksModal])

	const handleManageResourcePacksModalClose = useCallback(() => setShowManageResourcePacksModal(false), [setShowManageResourcePacksModal])

	const handleSaveResourcepacks = useCallback(selectedResourcepacks => {
		updateResourcepacks(selectedResourcepacks)
		setShowManageResourcePacksModal(false)
	}, [
		updateResourcepacks,
		setShowManageResourcePacksModal,
	])

	const handleExportMapClick = useCallback(() => setShowExportMapModal(true), [setShowExportMapModal])

	const handleExportMapModalClose = useCallback(() => setShowExportMapModal(false), [setShowExportMapModal])

	const Menu = useMemo(() => {
		return (
			<>
				<Button
					isFullWidth
					onClick={handleManageResourcePacksClick}>
					{'Manage Resourcepacks'}
				</Button>

				<Button
					isDisabled={!hasTiles}
					isFullWidth
					onClick={handleExportMapClick}>
					{'Export Map'}
				</Button>
			</>
		)
	}, [
		handleExportMapClick,
		handleManageResourcePacksClick,
		hasTiles,
	])

	return (
		<>
			<PanelContainer
				menu={Menu}
				panels={leftPanels} />

			{showExportMapModal && (
				<ExportModal onClose={handleExportMapModalClose} />
			)}

			{showManageResourcePacksModal && (
				<ManageResourcePacksModal
					onClose={handleManageResourcePacksModalClose}
					onSave={handleSaveResourcepacks} />
			)}
		</>
	)
}
