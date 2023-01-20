// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { NewAssetModal } from './NewAssetModal/NewAssetModal.jsx'
import { Panel } from '../scenes/Architect/Panel.jsx'
import { useEditor } from '../scenes/Architect/context/EditorContext.jsx'
import { useResourcepackEditorContext } from '../scenes/Architect/ResourcepackEditorContext/useResourcepackEditorContext.js'





/**
 * Allows management of assets.
 */
export function AssetsPanel() {
	const {
		addAssets,
		assets,
		removeAsset,
	} = useResourcepackEditorContext()
	const {
		closeItem,
		openItem,
	} = useEditor()
	const [showNewAssetModal, setShowNewAssetModal] = useState(false)

	const handleAddToProject = useCallback(files => {
		addAssets(files)
		setShowNewAssetModal(false)

		Object.entries(files).forEach(([itemID, item]) => {
			openItem({
				item,
				itemID,
				type: 'asset',
			})
		})
	}, [
		addAssets,
		openItem,
		setShowNewAssetModal,
	])

	const handleEditAssetClick = useCallback(assetID => () => {
		openItem({
			item: assets[assetID],
			itemID: assetID,
			type: 'asset',
		})
	}, [
		assets,
		openItem,
	])

	const handleRemoveAssetClick = useCallback(assetID => () => {
		removeAsset(assetID)
		closeItem(assetID)
	}, [
		closeItem,
		removeAsset,
	])

	const handleNewAssetClick = useCallback(() => setShowNewAssetModal(true), [setShowNewAssetModal])

	const handleNewAssetModalClose = useCallback(() => setShowNewAssetModal(false), [setShowNewAssetModal])

	const Menu = useMemo(() => (
		<Button
			isFullWidth
			onClick={handleNewAssetClick}>
			{'+ New Asset'}
		</Button>
	), [handleNewAssetClick])

	return (
		<>
			<Panel
				className={'assets'}
				isCollapsible
				menu={Menu}
				title={'Assets'}>
				<ol className={'block-list'}>
					{!Object.keys(assets).length && (
						<li className={'empty-message'}>
							{'Create a new asset.'}
						</li>
					)}

					{Object.entries(assets).map(([assetID, asset]) => (
						<li key={assetID}>
							<img
								alt={''}
								src={asset.dataURL} />

							<div className={'details'}>{asset.name}</div>

							<menu type={'toolbar'}>
								<Button
									data-assetid={assetID}
									isSmall
									onClick={handleEditAssetClick(assetID)}>
									{'Edit'}
								</Button>

								<Button
									isNegative
									isSmall
									onClick={handleRemoveAssetClick(assetID)}>
									{'Remove'}
								</Button>
							</menu>
						</li>
					))}
				</ol>
			</Panel>

			{showNewAssetModal && (
				<NewAssetModal
					onAddToProject={handleAddToProject}
					onClose={handleNewAssetModalClose} />
			)}
		</>
	)
}
