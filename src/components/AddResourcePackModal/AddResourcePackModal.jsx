// Module imports
import {
	useCallback,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import styles from './AddResourcePackModal.module.scss'

import { Button } from '../Button.jsx'
import { Modal } from '../Modal.jsx'
import { Resourcepack } from './ResourcePack.jsx'
import { useStore } from '../../store/react.js'





/**
 * Renders a modal for creating or editing a tile.
 *
 * @param {*} props
 */
export function AddResourcePackModal(props) {
	const { onClose } = props

	const { contentManager } = useStore(state => {
		return {
			contentManager: state.contentManager,
		}
	})

	const [selectedResourcePacks, setSelectedResourcePacks] = useState(Object.keys(contentManager.resourcepacks).reduce((accumulator, resourcepackID) => {
		accumulator[resourcepackID] = false
		return accumulator
	}, {}))

	const handleResourcePackClick = useCallback((resourcepackID, isChecked) => {
		setSelectedResourcePacks(previousState => {
			const newState = { ...previousState }

			newState[resourcepackID] = isChecked

			return newState
		})
	}, [setSelectedResourcePacks])

	const handleSubmit = useCallback(event => {
		event.preventDefault()
	}, [])

	return (
		<Modal
			className={styles['add-resource-pack-modal']}
			onClose={onClose}
			title={'Manage Resource Packs'}>
			<form onSubmit={handleSubmit}>
				<div className={'form-contents'}>
					<ul className={styles['resourcepacks']}>
						{Object.values(contentManager.resourcepacks).map(resourcepack => {
							return (
								<li key={resourcepack.id}>
									<Resourcepack
										isSelected={selectedResourcePacks[resourcepack.id]}
										onSelect={handleResourcePackClick}
										resourcepack={resourcepack} />
								</li>
							)
						})}
					</ul>
				</div>

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

AddResourcePackModal.defaultProps = {
}

AddResourcePackModal.propTypes = {
	onClose: PropTypes.func.isRequired,
}
