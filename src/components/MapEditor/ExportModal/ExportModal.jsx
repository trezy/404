// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import styles from './ExportModal.module.scss'

import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { Modal } from '../../Modal/Modal.jsx'
import { useEditor } from '../../scenes/Architect/context/EditorContext.jsx'





export function ExportModal(props) {
	const {
		onClose,
	} = props

	const {
		hasTiles,
		name,
		saveMap,
		setName,
	} = useEditor()

	const [isLoading, setIsLoading] = useState(false)

	const isValid = useMemo(() => {
		if (!name) {
			return false
		}

		if (!hasTiles) {
			return false
		}

		return true
	}, [
		hasTiles,
		name,
	])

	const handleNameChange = useCallback(event => setName(event.target.value), [setName])

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
							value={name} />
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

						<ButtonStack isCollapsed>
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
						</ButtonStack>
					</div>
				</menu>
			</footer>
		</Modal>
	)
}

ExportModal.propTypes = {
	onClose: PropTypes.func.isRequired,
}
