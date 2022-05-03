// Remote imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { NewTileModal } from './NewTileModal.jsx'
import { Panel } from './Panel.jsx'
import { useAssets } from './context/AssetsContext.jsx'
// import { useEditor } from './context/EditorContext.jsx'





export function TilesPanel() {
	const { assets } = useAssets()
	// const { setActiveTile } = useEditor()

	const [showNewTileModal, setShowNewTileModal] = useState(false)

	const handleAddToProject = useCallback(() => {}, [])

	const handleNewTileClick = useCallback(() => setShowNewTileModal(true), [setShowNewTileModal])

	const handleNewTileModalClose = useCallback(() => setShowNewTileModal(false), [setShowNewTileModal])

	const Menu = useMemo(() => (
		<Button
			isDisabled={!Object.keys(assets).length}
			isFullWidth
			onClick={handleNewTileClick}>
			{'+ New Tile'}
		</Button>
	), [
		assets,
		handleNewTileClick,
	])

	return (
		<>
			<Panel
				className={'tiles-panel'}
				menu={Menu}
				title={'Tiles'}>
				<ol className={'block-list layers-list'}>
					{!Object.keys(assets).length && (
						<li className={'empty-message'}>
							{'Load an asset to create tiles.'}
						</li>
					)}

					{Boolean(Object.keys(assets).length) && (
						<li className={'empty-message'}>
							{'Create a new tile.'}
						</li>
					)}
				</ol>
			</Panel>

			{showNewTileModal && (
				<NewTileModal
					onAddToProject={handleAddToProject}
					onClose={handleNewTileModalClose} />
			)}
		</>
	)
}
