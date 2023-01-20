// Module imports
import { useMemo } from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonGroup } from '../ButtonGroup/ButtonGroup.jsx'
import { Editor } from '../Editor/Editor.jsx'
import { EditorContainer } from '../EditorContainer/EditorContainer.jsx'
import { EditorControls } from '../EditorControls/EditorControls.jsx'
import { useEditorContext } from '../Editor/Context/useEditorContext.js'





/**
 * Renders a canvas for painting tiles to build a map.
 */
export function MapEditorCanvas() {
	const {
		activateBrushTool,
		activateEraserTool,
		activateMarqueeTool,
		activateMoveTool,
		defaultZoom,
		tool,
		zoom,
		zoomIn,
		zoomOut,
	} = useEditorContext()

	const controls = useMemo(() => {
		return [
			{
				title: 'Tools',
				children: (
					<ButtonGroup>
						<Button
							isAffirmative={tool === 'move'}
							isUniformlyPadded
							onClick={activateMoveTool}>
							<img
								alt={'Move Tool'}
								src={'/static/assets/tools/move.png'} />
						</Button>

						<Button
							isAffirmative={tool === 'eraser'}
							isUniformlyPadded
							onClick={activateEraserTool}>
							<img
								alt={'Eraser Tool'}
								src={'/static/assets/tools/eraser.png'} />
						</Button>

						<Button
							isAffirmative={tool === 'marquee'}
							isUniformlyPadded
							onClick={activateMarqueeTool}>
							<img
								alt={'Marquee Tool'}
								src={'/static/assets/tools/marquee.png'} />
						</Button>

						<Button
							isAffirmative={tool === 'brush'}
							isUniformlyPadded
							onClick={activateBrushTool}>
							<img
								alt={'Brush Tool'}
								src={'/static/assets/tools/brush.png'} />
						</Button>
					</ButtonGroup>
				),
			},

			{
				title: 'Zoom',
				children: (
					<ButtonGroup>
						<Button
							isUniformlyPadded
							onClick={zoomOut}>
							{'-'}
						</Button>

						<div>
							{`${(zoom - defaultZoom + 1) * 100}%`}
						</div>

						<Button
							isUniformlyPadded
							onClick={zoomIn}>
							{'+'}
						</Button>
					</ButtonGroup>
				),
			},
		]
	}, [])

	return (
		<EditorContainer>
			<Editor
				showMapGrid
				showTransparencyGrid={false} />

			<EditorControls controls={controls} />
		</EditorContainer>
	)
}
