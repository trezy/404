// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ExportModal } from '../ExportModal/ExportModal.jsx'
import { PanelContainer } from '../../PanelContainer/PanelContainer.jsx'
import { ResourcepacksPanel } from '../ResourcepacksPanel/ResourcepacksPanel.jsx'
import { TilePalettePanel } from '../TilePalettePanel/TilePalettePanel.jsx'
// import { TileQueuePanel } from '../TileQueuePanel/TileQueuePanel.jsx'





/**
 * Renders the left side of the map editor.
 */
export function LeftPanelContainer() {
	const leftPanels = useMemo(() => {
		return [
			ResourcepacksPanel,
			TilePalettePanel,
			// TileQueuePanel,
		]
	}, [])

	const [showExportMapModal, setShowExportMapModal] = useState(false)

	const handleExportMapClick = useCallback(() => setShowExportMapModal(true), [setShowExportMapModal])

	const handleExportMapModalClose = useCallback(() => setShowExportMapModal(false), [setShowExportMapModal])

	const Menu = useMemo(() => {
		return (
			<>
				<Button isFullWidth>
					{'Manage Resourcepacks'}
				</Button>

				<Button
					isFullWidth
					onClick={handleExportMapClick}>
					{'Export Map'}
				</Button>
			</>
		)
	}, [])

	return (
		<>
			<PanelContainer
				menu={Menu}
				panels={leftPanels} />

			{showExportMapModal && (
				<ExportModal onClose={handleExportMapModalClose} />
			)}
		</>
	)
}
