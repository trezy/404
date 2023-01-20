// Local imports
import { EditorWrapper } from '../EditorWrapper/EditorWrapper.jsx'
import { LeftPanelContainer } from './LeftPanelContainer/LeftPanelContainer.jsx'
import { ResourcepackEditorCanvas } from './ResourcepackEditorCanvas.jsx'
import { ResourcepackEditorContextProvider } from './Context/ResourcepackEditorContextProvider.jsx'





/**
 * Renders the map editor.
 */
export function ResourcepackEditor() {
	return (
		<EditorWrapper>
			<ResourcepackEditorContextProvider>
				<LeftPanelContainer />

				<ResourcepackEditorCanvas />
			</ResourcepackEditorContextProvider>
		</EditorWrapper>
	)
}
