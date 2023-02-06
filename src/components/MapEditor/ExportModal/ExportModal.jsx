// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'
import { useStore } from 'statery'





// Local imports
import {
	getMap,
	hasTiles,
	hideExportMapModal,
	saveMap,
	store,
	updateMap,
} from '../store.js'
import { Button } from '../../Button.jsx'
import { DropdownButton } from '../../DropdownButton/DropdownButton.jsx'
import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { Modal } from '../../Modal/Modal.jsx'





export function ExportModal() {
	const proxyStore = useStore(store)
	const map = getMap(proxyStore)

	const [isLoading, setIsLoading] = useState(false)
	const [loaderText, setLoaderText] = useState('Saving...')

	const isValid = useMemo(() => {
		if (!map.name) {
			return false
		}

		return true
	}, [map])

	const handleClose = useCallback(() => hideExportMapModal(), [])

	const handleNameChange = useCallback(event => {
		updateMap({
			name: event.target.value,
		})
	}, [])

	const handleSave = useCallback(async() => {
		setIsLoading(true)
		setLoaderText('Saving...')

		executePromiseWithMinimumDuration(saveMap(), 2000)
			.then(() => {
				setLoaderText('Saved!')
				setTimeout(() => {
					setIsLoading(false)
					hideExportMapModal()
				}, 2000)
			})
	}, [
		saveMap,
		setIsLoading,
		setLoaderText,
	])

	return (
		<Modal
			isLoading={isLoading}
			loaderText={loaderText}
			onClose={handleClose}
			title={'Export Map'}>
			<form onSubmit={handleSave}>
				<div className={'form-contents'}>
					<div className={'field'}>
						<label>{'Name'}</label>
						<input
							name={'name'}
							onChange={handleNameChange}
							type={'text'}
							value={map.name} />
					</div>
				</div>
			</form>

			<footer>
				<menu type={'toolbar'}>
					<div className={'menu-right'}>
						<Button
							isNegative
							onClick={handleClose}>
							{'Cancel'}
						</Button>

						<DropdownButton isCollapsed>
							<Button
								isAffirmative
								isDisabled={!isValid}
								onClick={handleSave}>
								{'Save'}
							</Button>

							<Button isDisabled={!isValid}>
								{'Publish'}
							</Button>

							<Button>
								{'Export'}
							</Button>
						</DropdownButton>
					</div>
				</menu>
			</footer>
		</Modal>
	)
}
