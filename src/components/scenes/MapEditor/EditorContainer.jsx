// Local imports
import { AssetEditor } from './AssetEditor.jsx'
import { EditorControls } from './EditorControls.jsx'
import { OpenItemTabs } from './OpenItemTabs.jsx'
import { useEditor } from './context/EditorContext.jsx'





export function EditorContainer() {
	const {
		focusedItemID,
		openItems,
	} = useEditor()

	return (
		<div className={'editor-container'}>
			<OpenItemTabs />

			{(Boolean(focusedItemID) && (openItems[focusedItemID]?.type === 'asset')) && (
				<AssetEditor assetID={focusedItemID} />
			)}

			<EditorControls />
		</div>
	)
}
