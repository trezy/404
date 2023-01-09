// Module imports
import { useMemo } from 'react'





// Local imports
import { Editor } from '../scenes/Architect/Editor.jsx'





/**
 * Renders a canvas for painting tiles to build a map.
 */
export function MapEditorCanvas() {
	return (
		<div className={'editor-container'}>
			<Editor
				showMapGrid
				showTransparencyGrid={false} />

			<menu
				className={'editor-controls'}
				type={'toolbar'} />
		</div>
	)
}
