// Local imports
import { Editor } from '../scenes/Architect/Editor.jsx'
import { EditorControls } from './EditorControls/EditorControls.jsx'





/**
 * Renders a canvas for painting tiles to build a map.
 */
export function MapEditorCanvas() {
	return (
		<div className={'editor-container'}>
			<Editor
				showMapGrid
				showTransparencyGrid={false} />

			<EditorControls />
		</div>
	)
}
