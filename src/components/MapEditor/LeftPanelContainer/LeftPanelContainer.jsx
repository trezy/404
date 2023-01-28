// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ExportModal } from '../ExportModal/ExportModal.jsx'
import { LoadMapModal } from '../LoadMapModal/LoadMapModal.jsx'
import { ManageResourcePacksModal } from '../ManageResourcePacksModal/ManageResourcePacksModal.jsx'
import { PanelContainer } from '../../PanelContainer/PanelContainer.jsx'
import { TilePalettePanel } from '../TilePalettePanel/TilePalettePanel.jsx'
import { useMapEditorContext } from '../Context/useMapEditorContext.js'
import { useStore } from '../../../store/react.js'





/**
 * Renders the left side of the map editor.
 */
export function LeftPanelContainer() {
	const {
		hasDestinations,
		hasStartingPosition,
		hasTiles,
		updateResourcepacks,
	} = useMapEditorContext()

	const goToMainMenu = useStore(state => state.goToMainMenu)

	const leftPanels = useMemo(() => {
		return [
			TilePalettePanel,
		]
	}, [])

	const [showExportMapModal, setShowExportMapModal] = useState(false)
	const [showLoadMapModal, setShowLoadMapModal] = useState(false)
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

	const handleLoadMapClick = useCallback(() => setShowLoadMapModal(true), [setShowLoadMapModal])

	const handleLoadMapModalClose = useCallback(() => setShowLoadMapModal(false), [setShowLoadMapModal])

	const handleMainMenuClick = useCallback(() => goToMainMenu(), [goToMainMenu])

	const Menu = useMemo(() => {
		return (
			<>
				<Button
					isFullWidth
					onClick={handleManageResourcePacksClick}>
					{'Manage Resourcepacks'}
				</Button>

				<Button
					isDisabled={!hasTiles || !hasDestinations || !hasStartingPosition}
					isFullWidth
					onClick={handleExportMapClick}>
					{'Export Map'}
				</Button>

				<Button
					isFullWidth
					onClick={handleLoadMapClick}>
					{'Load Map'}
				</Button>

				<Button
					isFullWidth
					onClick={handleMainMenuClick}>
					{'Main Menu'}
				</Button>
			</>
		)
	}, [
		handleExportMapClick,
		handleLoadMapClick,
		handleManageResourcePacksClick,
		hasDestinations,
		hasStartingPosition,
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

			{showLoadMapModal && (
				<LoadMapModal onClose={handleLoadMapModalClose} />
			)}

			{showManageResourcePacksModal && (
				<ManageResourcePacksModal
					onClose={handleManageResourcePacksModalClose}
					onSave={handleSaveResourcepacks} />
			)}
		</>
	)
}
