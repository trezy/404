// Module imports
import PropTypes from 'prop-types'
import { useCallback } from 'react'
// import { v4 as uuid } from 'uuid'





// Local imports
import { Button } from '../../Button.jsx'
import { Modal } from '../../Modal.jsx'





export function NewTileModal(props) {
	const {
		onClose,
		onAddToProject,
	} = props

	const handleAddToProject = useCallback(() => {
		onAddToProject()
	}, [onAddToProject])

	return (
		<Modal
			className={'new-assets'}
			onClose={onClose}
			title={'Create New Tile'}>
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
							onClick={handleAddToProject}>
							{'Add to Project'}
						</Button>
					</div>
				</menu>
			</footer>
		</Modal>
	)
}

NewTileModal.propTypes = {
	onAddToProject: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
}
