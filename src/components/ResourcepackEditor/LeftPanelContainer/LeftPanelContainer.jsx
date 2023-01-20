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
import { useResourcepackEditorContext } from '../ResourcepackEditorContext/useResourcepackEditorContext.js'





/**
 * Renders the left side of the map editor.
 */
export function LeftPanelContainer() {
	const {
		hasTiles,
		isExporting,
		isSaving,
	} = useResourcepackEditorContext()

	const leftPanels = useMemo(() => {
		return [
			AssetsPanel,
			TilesPanel,
		]
	}, [])

	const [showExportResourcepackModal, setShowExportResourcepackModal] = useState(false)

	const handleExportResourcepackClick = useCallback(() => setShowExportResourcepackModal(true), [setShowExportResourcepackModal])

	const handleExportResourcepackModalClose = useCallback(() => setShowExportResourcepackModal(false), [setShowExportResourcepackModal])

	const Menu = useMemo(() => {
		return (
			<Button
				isDisabled={!hasTiles || isSaving || isExporting}
				isFullWidth
				onClick={handleExportResourcepackClick}>
				{'Export Resourcepack'}
			</Button>
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
