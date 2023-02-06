// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'
import numeral from 'numeral'
import { useStore } from 'statery'





// Local imports
import styles from './ManageResourcePacksModal.module.scss'

import {
	hideManageResourcePacksModal,
	store,
	updateMap,
} from '../store.js'
import { Button } from '../../Button.jsx'
import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { Modal } from '../../Modal/Modal.jsx'
import { Resourcepack } from './ResourcePack.jsx'





/**
 * Renders a modal for creating or editing a tile.
 *
 * @param {*} props
 */
export function ManageResourcePacksModal(props) {
	const [isLoading, setIsLoading] = useState(false)
	const {
		activeTabID,
		contentManager,
		maps,
	} = useStore(store)

	const map = useMemo(() => maps[activeTabID], [
		activeTabID,
		maps,
	])

	const handleClose = useCallback(() => hideManageResourcePacksModal(), [hideManageResourcePacksModal])

	const resourcepacks = useMemo(() => {
		return Object
			.keys(map.dependencies)
			.reduce((accumulator, resourcepackID) => {
				accumulator[resourcepackID] = { ...contentManager.getResourcepack(resourcepackID) }
				return accumulator
			}, {})
	}, [map])

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

	const updateResourcepacks = useCallback(async () => {
		const resourcePackIDs = Object
			.keys(selectedResourcepacks)
			.filter(resourcepackID => selectedResourcepacks[resourcepackID])

		for await (const resourcePackID of resourcePackIDs) {
			await contentManager.loadResourcepack(resourcePackID)
		}

		updateMap({
			dependencies: resourcePackIDs.reduce((accumulator, resourcepackID) => {
				accumulator[resourcepackID] = contentManager.getResourcepack(resourcepackID).version
				return accumulator
			}, {}),
		})

		hideManageResourcePacksModal()
	}, [
		contentManager,
		map,
		selectedResourcepacks,
	])

	const handleSubmit = useCallback(event => {
		event.preventDefault()

		setIsLoading(true)

		executePromiseWithMinimumDuration(updateResourcepacks(), 2000)
			.then(() => {
				setIsLoading(false)
			})
	}, [updateResourcepacks])

	return (
		<Modal
			className={styles['add-resource-pack-modal']}
			isLoading={isLoading}
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
