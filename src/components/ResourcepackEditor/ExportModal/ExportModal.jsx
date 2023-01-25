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
import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { Modal } from '../../Modal/Modal.jsx'
import { useResourcepackEditorContext } from '../Context/useResourcepackEditorContext.js'





export function ExportModal(props) {
	const { onClose } = props

	const {
		exportTileset,
		hasTiles,
		isExporting,
		isSaving,
		saveTileset,
		tilesetName,
		updateTilesetName,
	} = useResourcepackEditorContext()

	const [isLoading, setIsLoading] = useState(false)
	const [loaderText, setLoaderText] = useState('Saving...')

	const isValid = useMemo(() => {
		if (!tilesetName) {
			return false
		}

		if (!hasTiles) {
			return false
		}

		return true
	}, [
		hasTiles,
		tilesetName,
	])

	const handleNameChange = useCallback(event => updateTilesetName(event.target.value), [updateTilesetName])

	const handleExportClick = useCallback(async() => {
		setLoaderText('Exporting...')
		setIsLoading(true)

		executePromiseWithMinimumDuration(exportTileset(), 2000)
			.then(() => {
				setLoaderText('Exported!')
				setTimeout(() => setIsLoading(false), 2000)
			})
	}, [
		exportTileset,
		setIsLoading,
		setLoaderText,
	])

	const handleSaveClick = useCallback(async() => {
		setIsLoading(true)

		setLoaderText('Saving...')
		setIsLoading(true)

		executePromiseWithMinimumDuration(saveTileset(), 2000)
			.then(() => {
				setLoaderText('Saved!')
				setTimeout(() => setIsLoading(false), 2000)
			})
	}, [
		saveTileset,
		setIsLoading,
		setLoaderText,
	])

	return (
		<Modal
			isLoading={isLoading}
			loaderText={loaderText}
			onClose={onClose}
			title={'Export Resourcepack'}>

			<form onSubmit={handleSaveClick}>
				<div className={'form-contents'}>
					<div className={'field'}>
						<label>{'Name'}</label>
						<input
							name={'name'}
							onChange={handleNameChange}
							type={'text'}
							value={tilesetName} />
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
								isDisabled={!isValid || isExporting || isSaving}
								onClick={handleSaveClick}>
								{'Save'}
							</Button>

							<Button isDisabled={!isValid || isExporting || isSaving}>
								{'Publish'}
							</Button>

							<Button
								isDisabled={isExporting || isSaving}
								onClick={handleExportClick}>
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
