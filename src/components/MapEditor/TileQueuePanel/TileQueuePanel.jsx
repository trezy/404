// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import { useStore } from 'statery'





// Local imports
import {
	createTileset,
	getMap,
	openTileset,
	removeTileset,
	store,
} from '../store.js'
import { Button } from '../../Button.jsx'
import { ButtonGroup } from '../../ButtonGroup/ButtonGroup.jsx'
import { CollapsiblePanel } from '../../CollapsiblePanel/CollapsiblePanel.jsx'
import { BlockList } from '../../BlockList/BlockList.jsx'
import { BlockListItem } from '../../BlockList/BlockListItem.jsx'





export function TileQueuePanel() {
	const proxyStore = useStore(store)
	const { activeTabID } = proxyStore
	const map = getMap(proxyStore)

	const handleEditTilesetClick = useCallback(tilesetID => () => openTileset(tilesetID), [])

	const handleNewTilesetClick = useCallback(() => {
		const tilesetID = createTileset()
		openTileset(tilesetID)
	}, [])

	const handleRemoveTilesetClick = useCallback(tilesetID => () => removeTileset(tilesetID), [])

	const mappedTilesets = useMemo(() => {
		if (!map?.queue.length) {
			return null
		}

		return map.queue.map((tileset, index) => {
			return (
				<BlockListItem key={tileset.id}>
					{`Item ${index + 1}`}

					<menu type={'toolbar'}>
						<ButtonGroup>
							<Button
								isUniformlyPadded
								onClick={handleEditTilesetClick(tileset.id)}>
								<img
									alt={'Edit asset'}
									src={'/static/assets/tools/pencil.png'} />
							</Button>

							<Button
								isNegative
								isUniformlyPadded
								onClick={handleRemoveTilesetClick(tileset.id)}>
								<img
									alt={'Remove asset'}
									src={'/static/assets/tools/trash.png'} />
							</Button>
						</ButtonGroup>
					</menu>
				</BlockListItem>
			)
		})
		map?.queue
	}, [map])

	const Menu = (
		<Button
			isDisabled={!activeTabID}
			isFullWidth
			onClick={handleNewTilesetClick}>
			{'+ New Tileset'}
		</Button>
	)

	return (
		<CollapsiblePanel
			className={'queue-panel'}
			menu={Menu}
			title={'Queue'}>
			<BlockList>
				{!activeTabID && (
					<BlockListItem isEmpty>
						{'Open a map to manage its queue.'}
					</BlockListItem>
				)}

				{(activeTabID && !map.queue.length) && (
					<BlockListItem isEmpty>
						{'Create a new tileset.'}
					</BlockListItem>
				)}

				{mappedTilesets}
			</BlockList>
		</CollapsiblePanel>
	)
}
