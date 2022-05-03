// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { NewAssetModal } from './NewAssetModal.jsx'
import { Panel } from './Panel.jsx'
import { useAssets } from './context/AssetsContext.jsx'
import { useEditor } from './context/EditorContext.jsx'





export function AssetsPanel() {
	const {
		addAssets,
		assets,
		removeAsset,
	} = useAssets()
	const { openItem } = useEditor()
	const [showNewAssetModal, setShowNewAssetModal] = useState(false)

	const handleAddToProject = useCallback(files => {
		addAssets(files)
		setShowNewAssetModal(false)
	}, [
		addAssets,
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
	}, [removeAsset])

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
				menu={Menu}
				title={'Assets'}>
				<ol className={'block-list layers-list'}>
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
								<div className={'menu-right'}>
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
								</div>
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
