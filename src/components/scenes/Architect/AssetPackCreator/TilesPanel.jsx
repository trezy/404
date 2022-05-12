// Remote imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../../../Button.jsx'
import { NewTileModal } from './NewTileModal.jsx'
import { Panel } from '../Panel.jsx'
import { useAssets } from '../context/AssetsContext.jsx'
import { useEditor } from '../context/EditorContext.jsx'





export function TilesPanel() {
	const {
		assets,
		removeTile,
		tiles,
	} = useAssets()

	const { selection } = useEditor()

	const [showNewTileModal, setShowNewTileModal] = useState(false)

	const handleAddToProject = useCallback(() => {}, [])

	const handleNewTileClick = useCallback(() => setShowNewTileModal(true), [setShowNewTileModal])

	const handleNewTileModalClose = useCallback(() => setShowNewTileModal(false), [setShowNewTileModal])

	const handleEditTileClick = useCallback(tileID => () => {
		console.log('handleEditTileClick', tileID)
	}, [])

	const handleRemoveTileClick = useCallback(tileID => () => {
		removeTile(tileID)
	}, [removeTile])

	const hasAssets = useMemo(() => {
		return Boolean(Object.keys(assets).length)
	}, [assets])

	const hasTiles = useMemo(() => {
		return Boolean(Object.keys(tiles).length)
	}, [tiles])

	const mappedTiles = useMemo(() => {
		const tileEntries = Object.entries(tiles)

		return tileEntries.map(([tileID, tile]) => {
			return (
				<li key={tileID}>
					<img
						alt={tile.name}
						src={tile.dataURI}
						// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
						style={{
							height: `calc(${tile.height}px * var(--ui-scale))`,
							width: `calc(${tile.width}px * var(--ui-scale))`,
						}} />

					<div className={'details'}>{tile.name}</div>

					<menu type={'toolbar'}>
						<Button
							isSmall
							onClick={handleEditTileClick(tileID)}>
							{'Edit'}
						</Button>

						<Button
							isNegative
							isSmall
							onClick={handleRemoveTileClick(tileID)}>
							{'Remove'}
						</Button>
					</menu>
				</li>
			)
		})
	}, [
		handleEditTileClick,
		handleRemoveTileClick,
		tiles,
	])

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
				isCollapsible
				menu={Menu}
				title={'Tiles'}>
				<ol className={'block-list'}>
					{(!hasAssets && !hasTiles && !selection) && (
						<li className={'empty-message'}>
							{'Load an asset to create tiles.'}
						</li>
					)}

					{(hasAssets && !hasTiles && !selection) && (
						<li className={'empty-message'}>
							{'Selection part of the image to create a tile.'}
						</li>
					)}

					{(hasAssets && !hasTiles && selection) && (
						<li className={'empty-message'}>
							{'Create a new tile.'}
						</li>
					)}

					{hasTiles && mappedTiles}
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
