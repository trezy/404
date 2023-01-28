// Module imports
import {
	useCallback,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Button } from '../../Button.jsx'
import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { MapActions } from './MapActions.jsx'
import { Modal } from '../../Modal/Modal.jsx'
import { Table } from '../../Table/Table.jsx'
import { useMapEditorContext } from '../Context/useMapEditorContext.js'
import { useStore } from '../../../store/react.js'





export function LoadMapModal(props) {
	const { onClose } = props
	const [isLoading, setIsLoading] = useState(false)
	const [loaderText, setLoaderText] = useState('')
	const [selectedMapID, setSelectedMapID] = useState(null)

	const { loadMap } = useMapEditorContext()

	const contentManager = useStore(state => state.contentManager)

	const handleLoadClick = useCallback(async() => {
		setLoaderText('Loading...')
		setIsLoading(true)
		executePromiseWithMinimumDuration(loadMap(selectedMapID), 2000)
			.then(() => {
				setLoaderText('Loaded!')
				setTimeout(() => onClose(), 2000)
			})
	}, [
		contentManager,
		selectedMapID,
		setIsLoading,
	])

	const handleSelectMap = useCallback(mapID => {
		setSelectedMapID(mapID)
	}, [setSelectedMapID])

	const isRowSelected = useCallback(mapData => {
		return mapData.id === selectedMapID
	}, [selectedMapID])

	return (
		<Modal
			isLoading={isLoading}
			loaderText={loaderText}
			onClose={onClose}
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
							onClick={onClose}>
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

LoadMapModal.propTypes = {
	onClose: PropTypes.func.isRequired,
}
