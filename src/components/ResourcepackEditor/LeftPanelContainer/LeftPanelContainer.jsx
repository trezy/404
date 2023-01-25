// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { AssetsPanel } from '../AssetsPanel.jsx'
import { Button } from '../../Button.jsx'
import { ExportModal } from '../ExportModal/ExportModal.jsx'
import { PanelContainer } from '../../PanelContainer/PanelContainer.jsx'
import { TilesPanel } from '../TilesPanel.jsx'
import { useResourcepackEditorContext } from '../Context/useResourcepackEditorContext.js'
import { useStore } from '../../../store/react.js'





/**
 * Renders the left side of the map editor.
 */
export function LeftPanelContainer() {
	const {
		hasTiles,
		isExporting,
		isSaving,
	} = useResourcepackEditorContext()

	const goToMainMenu = useStore(state => state.goToMainMenu)

	const leftPanels = useMemo(() => {
		return [
			AssetsPanel,
			TilesPanel,
		]
	}, [])

	const [showExportResourcepackModal, setShowExportResourcepackModal] = useState(false)

	const handleExportResourcepackClick = useCallback(() => setShowExportResourcepackModal(true), [setShowExportResourcepackModal])

	const handleExportResourcepackModalClose = useCallback(() => setShowExportResourcepackModal(false), [setShowExportResourcepackModal])

	const handleMainMenuClick = useCallback(() => goToMainMenu(), [goToMainMenu])

	const Menu = useMemo(() => {
		return (
			<>
				<Button
					isDisabled={!hasTiles || isSaving || isExporting}
					isFullWidth
					onClick={handleExportResourcepackClick}>
					{'Export Resourcepack'}
				</Button>

				<Button
					isDisabled={isSaving || isExporting}
					isFullWidth
					onClick={handleMainMenuClick}>
					{'Main Menu'}
				</Button>
			</>
		)
	}, [
		handleExportResourcepackClick,
		hasTiles,
	])

	return (
		<>
			<PanelContainer
				menu={Menu}
				panels={leftPanels} />

			{showExportResourcepackModal && (
				<ExportModal onClose={handleExportResourcepackModalClose} />
			)}
		</>
	)
}
