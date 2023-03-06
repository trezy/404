// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import { useStore } from 'statery'





// Local imports
import {
	hasDestinations,
	hasStartingPosition,
	hasTiles,
	showExportMapModal,
	showLoadMapModal,
	showManageResourcePacksModal,
	store,
} from '../store.js'
import { Button } from '../../Button.jsx'
import { MAIN_MENU } from '../../../constants/SceneNames.js'
import { PanelContainer } from '../../PanelContainer/PanelContainer.jsx'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { TilePalettePanel } from '../TilePalettePanel/TilePalettePanel.jsx'
import { TileQueuePanel } from '../TileQueuePanel/TileQueuePanel.jsx'





function handleMainMenuClick() {
	pushScene(MAIN_MENU)
}

/**
 * Renders the left side of the map editor.
 */
export function LeftPanelContainer(props) {
	const { className } = props

	const storeProxy = useStore(store)
	const { activeTabID } = storeProxy

	const leftPanels = useMemo(() => {
		return [
			TilePalettePanel,
			TileQueuePanel,
		]
	}, [])

	const handleLoadMapClick = useCallback(() => showLoadMapModal(), [showLoadMapModal])

	const handleManageResourcePacksClick = useCallback(() => showManageResourcePacksModal(), [showManageResourcePacksModal])

	const handleSaveMapClick = useCallback(() => showExportMapModal(true), [showExportMapModal])

	const Menu = (
		<>
			<Button
				isDisabled={!activeTabID}
				isFullWidth
				onClick={handleManageResourcePacksClick}>
				{'Manage Resourcepacks'}
			</Button>

			<Button
				isDisabled={!hasTiles(storeProxy) || !hasDestinations(storeProxy) || !hasStartingPosition(storeProxy)}
				isFullWidth
				onClick={handleSaveMapClick}>
				{'Save Map'}
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

	return (
		<>
			<PanelContainer
				className={className}
				menu={Menu}
				panels={leftPanels} />
		</>
	)
}
