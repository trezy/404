// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { AddResourcePackModal } from '../../../AddResourcePackModal/AddResourcePackModal.jsx'
import { Button } from '../../../Button.jsx'
import { Panel } from '../Panel.jsx'
import { useEditor } from '../context/EditorContext.jsx'





/**
 * Allows managing of asset packs.
 */
export function ResourcepacksPanel() {
	const [showManageResourcePacksModal, setShowManageResourcePacksModal] = useState(false)
	const { resourcepacks } = useEditor()

	const handleManageResourcePacksClick = useCallback(() => setShowManageResourcePacksModal(true), [setShowManageResourcePacksModal])

	const handleManageResourcePacksModalClose = useCallback(() => setShowManageResourcePacksModal(false), [setShowManageResourcePacksModal])

	const Menu = useMemo(() => (
		<Button
			isFullWidth
			onClick={handleManageResourcePacksClick}>
			{'Manage'}
		</Button>
	), [handleManageResourcePacksClick])

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
				</ol>
			</Panel>

			{showManageResourcePacksModal && (
				<AddResourcePackModal onClose={handleManageResourcePacksModalClose} />
			)}
		</>
	)
}
