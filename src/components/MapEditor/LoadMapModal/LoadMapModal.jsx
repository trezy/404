// Module imports
import {
	useCallback,
	useState,
} from 'react'
import { useStore } from 'statery'





// Local imports
import {
	openMap,
	store,
} from '../store.js'
import { Button } from '../../Button.jsx'
import { hideLoadMapModal } from '../store.js'
import { MapActions } from './MapActions.jsx'
import { Modal } from '../../Modal/Modal.jsx'
import { Table } from '../../Table/Table.jsx'





export function LoadMapModal() {
	const { contentManager } = useStore(store)

	const [selectedMapID, setSelectedMapID] = useState(null)

	const handleClose = useCallback(() => hideLoadMapModal(), [hideLoadMapModal])

	const handleLoadClick = useCallback(async() => {
		openMap(selectedMapID)
		hideLoadMapModal()
	}, [
		hideLoadMapModal,
		openMap,
		selectedMapID,
	])

	const handleSelectMap = useCallback(mapID => {
		setSelectedMapID(mapID)
	}, [setSelectedMapID])

	const isRowSelected = useCallback(mapData => {
		return mapData.id === selectedMapID
	}, [selectedMapID])

	return (
		<Modal
			onClose={handleClose}
			title={'Load Map'}>
			<Table
				columns={[
					{
						key: 'name',
						label: 'Name',
					},
					{
						key: 'version',
						label: 'Version',
					},
					{
						component: MapActions,
						key: 'actions',
						onSelect: handleSelectMap,
					},
				]}
				data={Object.values(contentManager.maps)}
				isRowSelected={isRowSelected} />

			<footer>
				<menu type={'toolbar'}>
					<div className={'menu-right'}>
						<Button
							isNegative
							onClick={handleClose}>
							{'Cancel'}
						</Button>

						<Button
							isAffirmative
							isDisabled={!selectedMapID}
							onClick={handleLoadClick}>
							{'Load'}
						</Button>
					</div>
				</menu>
			</footer>
		</Modal>
	)
}
