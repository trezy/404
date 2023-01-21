// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'
import numeral from 'numeral'
import PropTypes from 'prop-types'





// Local imports
import styles from './ManageResourcePacksModal.module.scss'

import { Button } from '../../Button.jsx'
import { Modal } from '../../Modal/Modal.jsx'
import { Resourcepack } from './ResourcePack.jsx'
import { useMapEditorContext } from '../Context/useMapEditorContext.js'
import { useStore } from '../../../store/react.js'





/**
 * Renders a modal for creating or editing a tile.
 *
 * @param {*} props
 */
export function ManageResourcePacksModal(props) {
	const {
		onClose,
		onSave,
	} = props

	const { resourcepacks } = useMapEditorContext()

	const { contentManager } = useStore(state => {
		return {
			contentManager: state.contentManager,
		}
	})

	const [selectedResourcepacks, setSelectedResourcepacks] = useState(
		Object.keys(contentManager.resourcepacks).reduce((accumulator, resourcepackID) => {
			accumulator[resourcepackID] = Boolean(resourcepacks[resourcepackID])
			return accumulator
		}, {}),
	)

	const handleResourcePackClick = useCallback((resourcepackID, isChecked) => {
		setSelectedResourcepacks(previousState => {
			const newState = { ...previousState }

			newState[resourcepackID] = isChecked

			return newState
		})
	}, [setSelectedResourcepacks])

	const isSavable = useMemo(() => {
		return Boolean(Object.values(selectedResourcepacks).filter(Boolean).length)
	}, [selectedResourcepacks])

	const handleClose = useCallback(onClose, [onClose])

	const totalResourcepacksSize = useMemo(() => {
		const selectedResourcepackIDs = Object
			.entries(selectedResourcepacks)
			.filter(([, isSelected]) => isSelected)
			.map(([id]) => id)

		return selectedResourcepackIDs.reduce((accumulator, resourcepackID) => {
			return accumulator + contentManager.resourcepacks[resourcepackID].size
		}, 0)
	}, [
		contentManager,
		selectedResourcepacks,
	])

	const handleSubmit = useCallback(event => {
		event.preventDefault()
		onSave(selectedResourcepacks)
	}, [
		onSave,
		selectedResourcepacks,
	])

	return (
		<Modal
			className={styles['add-resource-pack-modal']}
			onClose={handleClose}
			title={'Manage Resource Packs'}>
			<form onSubmit={handleSubmit}>
				<div className={'form-contents'}>
					<ul className={styles['resourcepacks']}>
						{Object.values(contentManager.resourcepacks).map(resourcepack => {
							return (
								<li key={resourcepack.id}>
									<Resourcepack
										isSelected={selectedResourcepacks[resourcepack.id]}
										onSelect={handleResourcePackClick}
										resourcepack={resourcepack} />
								</li>
							)
						})}
					</ul>
				</div>

				<footer>
					<menu type={'toolbar'}>
						<div className={'menu-left'}>
							{numeral(totalResourcepacksSize).format('0.00 b')}
						</div>

						<div className={'menu-right'}>
							<Button
								isNegative
								onClick={handleClose}>
								{'Cancel'}
							</Button>

							<Button
								isAffirmative
								isDisabled={!isSavable}
								isSubmit>
								{'Save Changes'}
							</Button>
						</div>
					</menu>
				</footer>
			</form>
		</Modal>
	)
}

ManageResourcePacksModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
}
