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
import { useEditor } from './context/EditorContext.jsx'





export function TilesPanel() {
	const { assets } = useAssets()
	const { selection } = useEditor()

	const [showNewTileModal, setShowNewTileModal] = useState(false)

	const handleAddToProject = useCallback(() => {}, [])

	const handleNewTileClick = useCallback(() => setShowNewTileModal(true), [setShowNewTileModal])

	const handleNewTileModalClose = useCallback(() => setShowNewTileModal(false), [setShowNewTileModal])

	const hasAssets = useMemo(() => {
		return Boolean(Object.keys(assets).length)
	}, [assets])

	const Menu = useMemo(() => (
		<Button
			isDisabled={!hasAssets || !selection}
			isFullWidth
			onClick={handleNewTileClick}>
			{'+ New Tile'}
		</Button>
	), [
		handleNewTileClick,
		hasAssets,
		selection,
	])

	return (
		<>
			<Panel
				className={'tiles-panel'}
				menu={Menu}
				title={'Tiles'}>
				<ol className={'block-list layers-list'}>
					{!hasAssets && (
						<li className={'empty-message'}>
							{'Load an asset to create tiles.'}
						</li>
					)}

					{(hasAssets && !selection) && (
						<li className={'empty-message'}>
							{'Selection part of the image to create a tile.'}
						</li>
					)}

					{(hasAssets && selection) && (
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
