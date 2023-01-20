// Local imports
import { Editor } from '../scenes/Architect/Editor.jsx'
import { EditorControls } from './EditorControls/EditorControls.jsx'
import { OpenItemTabs } from './OpenItemTabs.jsx'
import { useEditor } from '../scenes/Architect/context/EditorContext.jsx'
import { useResourcepackEditorContext } from './ResourcepackEditorContext/useResourcepackEditorContext.js'





export function ResourcepackEditorCanvas() {
	const { focusedItemID } = useEditor()
	const { assets } = useResourcepackEditorContext()

	const asset = assets[focusedItemID]

	return (
		<div className={'editor-container'}>
			<OpenItemTabs />

			<Editor image={asset?.image} />

			<EditorControls />
		</div>
	)
}
