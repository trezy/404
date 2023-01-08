// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { AddResourcePackModal } from '../../AddResourcePackModal/AddResourcePackModal.jsx'
import { Button } from '../../Button.jsx'
import { Panel } from '../../scenes/Architect/Panel.jsx'
import { Resourcepack } from './Resourcepack.jsx'
import { useEditor } from '../../scenes/Architect/context/EditorContext.jsx'





/**
 * Allows managing of asset packs.
 */
export function ResourcepacksPanel() {
	const [showManageResourcePacksModal, setShowManageResourcePacksModal] = useState(false)
	const {
		addResourcepacks,
		resourcepacks,
	} = useEditor()

	const handleManageResourcePacksClick = useCallback(() => setShowManageResourcePacksModal(true), [setShowManageResourcePacksModal])

	const handleManageResourcePacksModalClose = useCallback(() => setShowManageResourcePacksModal(false), [setShowManageResourcePacksModal])

	const handleSaveResourcepacks = useCallback(resourcepackIDs => {
		addResourcepacks(resourcepackIDs)
		setShowManageResourcePacksModal(false)
	}, [
		addResourcepacks,
		setShowManageResourcePacksModal,
	])

	const Menu = useMemo(() => (
		<Button
			isFullWidth
			onClick={handleManageResourcePacksClick}>
			{'Manage'}
		</Button>
	), [handleManageResourcePacksClick])

	const mappedItems = useMemo(() => {
		return Object.values(resourcepacks).map(resourcepack => {
			return (
				<li key={resourcepack.id}>
					<Resourcepack resourcepack={resourcepack} />
				</li>
			)
		})
	}, [resourcepacks])

	return (
		<>
			<Panel
				className={'resource-packs-panel'}
				isCollapsible
				menu={Menu}
				title={'Resources'}>
				<ol className={'block-list'}>
					{!Object.keys(resourcepacks).length && (
						<li className={'empty-message'}>
							{'No resource packs.'}
						</li>
					)}

					{Boolean(Object.keys(resourcepacks).length) && mappedItems}
				</ol>
			</Panel>

			{showManageResourcePacksModal && (
				<AddResourcePackModal
					onClose={handleManageResourcePacksModalClose}
					onSave={handleSaveResourcepacks} />
			)}
		</>
	)
}
