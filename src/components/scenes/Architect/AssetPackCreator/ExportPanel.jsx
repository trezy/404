// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from '../../../Button.jsx'
import { NewAssetModal } from './NewAssetModal.jsx'
import { Panel } from '../Panel.jsx'
import { useAssets } from '../context/AssetsContext.jsx'





/**
 * The export panel allows the asset pack to be exported (for local testing), or submitted to the marketplace.
 */
export function ExportPanel() {
	const {
		tiles,
	} = useAssets()

	const handleExportAsFileClick = useCallback(() => {}, [])
	const handleSubmitToMarketplaceClick = useCallback(() => {}, [])

	const hasTiles = useMemo(() => {
		return Boolean(Object.keys(tiles).length)
	}, [tiles])

	const Menu = useMemo(() => (
		<>
			<Button
				isDisabled={!hasTiles}
				isFullWidth
				onClick={handleExportAsFileClick}>
				{'Export as File'}
			</Button>

			<Button
				isDisabled={!hasTiles}
				isFullWidth
				onClick={handleSubmitToMarketplaceClick}>
				{'Submit to Marketplace'}
			</Button>
		</>
	), [hasTiles])

	return (
		<>
			<Panel
				className={'export'}
				isCollapsible
				menu={Menu}
				title={'Export'} />

			{/* {showNewAssetModal && (
				<NewAssetModal
					onAddToProject={handleAddToProject}
					onClose={handleNewAssetModalClose} />
			)} */}
		</>
	)
}
