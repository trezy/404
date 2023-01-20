// Local imports
import { Editor } from '../Editor/Editor.jsx'
import { EditorControls } from './EditorControls/EditorControls.jsx'
import { OpenItemTabs } from './OpenItemTabs.jsx'
import { useEditorContext } from '../Editor/Context/useEditorContext.js'
import { useResourcepackEditorContext } from './Context/useResourcepackEditorContext.js'





export function ResourcepackEditorCanvas() {
	const { focusedItemID } = useEditorContext()
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
