// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ExportModal } from '../ExportModal/ExportModal.jsx'
import { ManageResourcePacksModal } from '../../ManageResourcePacksModal/ManageResourcePacksModal.jsx'
import { PanelContainer } from '../../PanelContainer/PanelContainer.jsx'
import { TilePalettePanel } from '../TilePalettePanel/TilePalettePanel.jsx'
// import { TileQueuePanel } from '../TileQueuePanel/TileQueuePanel.jsx'
import { useEditor } from '../../scenes/Architect/context/EditorContext.jsx'





/**
 * Renders the left side of the map editor.
 */
export function LeftPanelContainer() {
	const {
		resourcepacks,
		updateResourcepacks,
	} = useEditor()

	const leftPanels = useMemo(() => {
		return [
			TilePalettePanel,
			// TileQueuePanel,
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
					isFullWidth
					onClick={handleExportMapClick}>
					{'Export Map'}
				</Button>
			</>
		)
	}, [
		handleExportMapClick,
		handleManageResourcePacksClick,
	])

	useEffect(() => {
		if (!Object.keys(resourcepacks).length) {
			setShowManageResourcePacksModal(true)
		}
	}, [
		resourcepacks,
		setShowManageResourcePacksModal,
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
