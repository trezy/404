// Remote imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { EditTileModal } from './EditTileModal/EditTileModal.jsx'
import { CollapsiblePanel } from '../CollapsiblePanel/CollapsiblePanel.jsx'
import { useEditorContext } from '../Editor/Context/useEditorContext.js'
import { useResourcepackEditorContext } from './Context/useResourcepackEditorContext.js'





/**
 * Renders the panel for managing tiles in an asset pack.
 */
export function TilesPanel() {
	const {
		updateTile,
		assets,
		removeTile,
		tiles,
	} = useResourcepackEditorContext()

	const { selection } = useEditorContext()

	const [tileIDToEdit, setTileIDToEdit] = useState(null)
	const [showEditTileModal, setShowEditTileModal] = useState(false)

	const handleNewTileClick = useCallback(() => setShowEditTileModal(true), [setShowEditTileModal])

	const handleEditTileModalClose = useCallback(() => {
		setShowEditTileModal(false)
		setTileIDToEdit(null)
	}, [
		setShowEditTileModal,
		setTileIDToEdit,
	])

	const handleEditTileClick = useCallback(tileID => () => {
		setTileIDToEdit(tileID)
		setShowEditTileModal(true)
	}, [setShowEditTileModal])

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
			<CollapsiblePanel
				className={'tiles-panel'}
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
							{'Select part of the image to create a tile.'}
						</li>
					)}

					{(hasAssets && !hasTiles && selection) && (
						<li className={'empty-message'}>
							{'Create a new tile.'}
						</li>
					)}

					{hasTiles && mappedTiles}
				</ol>
			</CollapsiblePanel>

			{showEditTileModal && (
				<EditTileModal
					onAddToProject={updateTile}
					onClose={handleEditTileModalClose}
					tileID={tileIDToEdit} />
			)}
		</>
	)
}
