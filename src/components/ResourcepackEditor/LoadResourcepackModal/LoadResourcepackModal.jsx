// Module imports
import {
	useCallback,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Button } from '../../Button.jsx'
import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { Modal } from '../../Modal/Modal.jsx'
import { ResourcepackActions } from './ResourcepackActions.jsx'
import { Table } from '../../Table/Table.jsx'
import { useResourcepackEditorContext } from '../Context/useResourcepackEditorContext.js'
import { useStore } from '../../../store/react.js'





export function LoadResourcepackModal(props) {
	const { onClose } = props
	const [isLoading, setIsLoading] = useState(false)
	const [loaderText, setLoaderText] = useState('')
	const [selectedResourcepackID, setSelectedResourcepackID] = useState(null)

	const { loadResourcepack } = useResourcepackEditorContext()

	const contentManager = useStore(state => state.contentManager)

	const handleLoadClick = useCallback(async() => {
		setLoaderText('Loading...')
		setIsLoading(true)
		executePromiseWithMinimumDuration(loadResourcepack(selectedResourcepackID), 2000)
			.then(() => {
				setLoaderText('Loaded!')
				setTimeout(() => onClose(), 2000)
			})
	}, [
		contentManager,
		selectedResourcepackID,
		setIsLoading,
	])

	const handleSelectResourcepack = useCallback(resourcepackID => {
		setSelectedResourcepackID(resourcepackID)
	}, [setSelectedResourcepackID])

	const isRowSelected = useCallback(resourcepackData => {
		return resourcepackData.id === selectedResourcepackID
	}, [selectedResourcepackID])

	return (
		<Modal
			isLoading={isLoading}
			loaderText={loaderText}
			onClose={onClose}
			title={'Load Resourcepack'}>
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
						component: ResourcepackActions,
						key: 'actions',
						onSelect: handleSelectResourcepack,
					},
				]}
				data={Object.values(contentManager.resourcepacks)}
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
							isDisabled={!selectedResourcepackID}
							onClick={handleLoadClick}>
							{'Load'}
						</Button>
					</div>
				</menu>
			</footer>
		</Modal>
	)
}

LoadResourcepackModal.propTypes = {
	onClose: PropTypes.func.isRequired,
}
