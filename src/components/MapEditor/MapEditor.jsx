// Local imports
import { EditorWrapper } from '../EditorWrapper/EditorWrapper.jsx'
import { LeftPanelContainer } from './LeftPanelContainer/LeftPanelContainer.jsx'
import { MapEditorContextProvider } from './Context/MapEditorContextProvider.jsx'
import { MapEditorCanvas } from './MapEditorCanvas.jsx'





/**
 * Renders the map editor.
 */
export function MapEditor() {
	return (
		<EditorWrapper>
			<MapEditorContextProvider>
				<LeftPanelContainer />

				<MapEditorCanvas />
			</MapEditorContextProvider>
		</EditorWrapper>
	)
}
