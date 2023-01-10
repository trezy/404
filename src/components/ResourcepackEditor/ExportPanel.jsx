// Module imports
import {
	useCallback,
	useMemo,
} from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { Modal } from '../Modal/Modal.jsx'
import { Panel } from '../scenes/Architect/Panel.jsx'
import { useResourcepackEditor } from '../scenes/Architect/context/ResourcepackEditorContext.jsx'





/**
 * The export panel allows the asset pack to be exported (for local testing), or submitted to the marketplace.
 */
export function ExportPanel() {
	const {
		exportTileset,
		isExporting,
		isSaving,
		saveTileset,
		tiles,
		tilesetName,
		updateTilesetName,
	} = useResourcepackEditor()

	const handleExportClick = useCallback(() => exportTileset(), [exportTileset])

	const handleSaveClick = useCallback(() => saveTileset(), [saveTileset])

	const handlePublishClick = useCallback(() => {}, [])

	const handleTilesetNameChange = useCallback(event => updateTilesetName(event.target.value), [updateTilesetName])

	const hasTiles = useMemo(() => {
		return Boolean(Object.keys(tiles).length)
	}, [tiles])

	const Menu = useMemo(() => (
		<>
			<Button
				isDisabled={!hasTiles || isSaving || isExporting}
				isFullWidth
				onClick={handleSaveClick}>
				{'Save'}
			</Button>

			<Button
				isDisabled={!hasTiles || isSaving || isExporting}
				isFullWidth
				onClick={handleExportClick}>
				{'Export'}
			</Button>

			<Button
				isDisabled={!hasTiles || isSaving || isExporting}
				isFullWidth
				onClick={handlePublishClick}>
				{'Publish'}
			</Button>
		</>
	), [
		handleExportClick,
		handlePublishClick,
		handleSaveClick,
		hasTiles,
		isExporting,
		isSaving,
	])

	return (
		<>
			<Panel
				className={'export'}
				isCollapsible
				menu={Menu}
				title={'Export'}>
				<div className={'field'}>
					<label>
						{'Name'}
					</label>

					<input
						onChange={handleTilesetNameChange}
						type={'text'}
						value={tilesetName} />
				</div>
			</Panel>

			{isExporting && (
				<Modal
					isLoading
					title={'Exporting Tileset...'} />
			)}

			{isSaving && (
				<Modal
					isLoading
					title={'Saving Tileset...'} />
			)}
		</>
	)
}
