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
import { LoadResourcepackModal } from '../LoadResourcepackModal/LoadResourcepackModal.jsx'
import { MAIN_MENU } from '../../../constants/SceneNames.js'
import { PanelContainer } from '../../PanelContainer/PanelContainer.jsx'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { TilesPanel } from '../TilesPanel.jsx'
import { useResourcepackEditorContext } from '../Context/useResourcepackEditorContext.js'





function handleMainMenuClick() {
	pushScene(MAIN_MENU)
}

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
	const [showLoadResourcepackModal, setShowLoadResourcepackModal] = useState(false)

	const handleExportResourcepackClick = useCallback(() => setShowExportResourcepackModal(true), [setShowExportResourcepackModal])
	const handleExportResourcepackModalClose = useCallback(() => setShowExportResourcepackModal(false), [setShowExportResourcepackModal])

	const handleLoadResourcepackClick = useCallback(() => setShowLoadResourcepackModal(true), [setShowLoadResourcepackModal])
	const handleLoadResourcepackModalClose = useCallback(() => setShowLoadResourcepackModal(false), [setShowLoadResourcepackModal])

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
					isFullWidth
					onClick={handleLoadResourcepackClick}>
					{'Load Resourcepack'}
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

			{showLoadResourcepackModal && (
				<LoadResourcepackModal onClose={handleLoadResourcepackModalClose} />
			)}
		</>
	)
}
