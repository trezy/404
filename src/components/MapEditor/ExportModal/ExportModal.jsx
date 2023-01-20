// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Button } from '../../Button.jsx'
import { DropdownButton } from '../../DropdownButton/DropdownButton.jsx'
import { Modal } from '../../Modal/Modal.jsx'
import { useMapEditorContext } from '../Context/useMapEditorContext.js'





export function ExportModal(props) {
	const {
		onClose,
	} = props

	const {
		hasTiles,
		mapName,
		saveMap,
		setMapName,
	} = useMapEditorContext()

	const [isLoading, setIsLoading] = useState(false)

	const isValid = useMemo(() => {
		if (!mapName) {
			return false
		}

		if (!hasTiles) {
			return false
		}

		return true
	}, [
		hasTiles,
		mapName,
	])

	const handleNameChange = useCallback(event => setMapName(event.target.value), [setMapName])

	const handleSave = useCallback(async() => {
		setIsLoading(true)

		await saveMap()

		setIsLoading(false)
	}, [
		saveMap,
		setIsLoading,
	])

	return (
		<Modal
			isLoading={isLoading}
			onClose={onClose}
			title={'Export Map'}>

			<form onSubmit={handleSave}>
				<div className={'form-contents'}>
					<div className={'field'}>
						<label>{'Name'}</label>
						<input
							name={'name'}
							onChange={handleNameChange}
							type={'text'}
							value={mapName} />
					</div>
				</div>
			</form>

			<footer>
				<menu type={'toolbar'}>
					<div className={'menu-right'}>
						<Button
							isNegative
							onClick={onClose}>
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

ExportModal.propTypes = {
	onClose: PropTypes.func.isRequired,
}
