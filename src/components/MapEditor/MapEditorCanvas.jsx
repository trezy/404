// Module imports
import {
	useCallback,
	useEffect,
} from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonGroup } from '../ButtonGroup/ButtonGroup.jsx'
import { Editor } from '../Editor/Editor.jsx'
import { EditorContainer } from '../EditorContainer/EditorContainer.jsx'
import { EditorControls } from '../EditorControls/EditorControls.jsx'
import { Switch } from '../Switch/Switch.jsx'
import { useEditorContext } from '../Editor/Context/useEditorContext.js'





/**
 * Renders a canvas for painting tiles to build a map.
 */
export function MapEditorCanvas() {
	const {
		activateBrushTool,
		activateDestinationTool,
		activateEraserTool,
		// activateMarqueeTool,
		activateMoveTool,
		activateStartingPositionTool,
		defaultZoom,
		isPathfindingGridVisible,
		isStartingPositionVisible,
		setIsPathfindingGridVisible,
		setIsStartingPositionVisible,
		tool,
		zoom,
		zoomIn,
		zoomOut,
	} = useEditorContext()

	const handleShowPathfindingGridChange = useCallback(setIsPathfindingGridVisible, [setIsPathfindingGridVisible])

	const handleShowStartingPositionChange = useCallback(setIsStartingPositionVisible, [setIsStartingPositionVisible])

	const controls = [
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

					{/* <Button
						isAffirmative={tool === 'marquee'}
						isUniformlyPadded
						onClick={activateMarqueeTool}>
						<img
							alt={'Marquee Tool'}
							src={'/static/assets/tools/marquee.png'} />
					</Button> */}

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
			title: 'Points',
			children: (
				<ButtonGroup>
					<Button
						isAffirmative={tool === 'startingPosition'}
						isUniformlyPadded
						onClick={activateStartingPositionTool}>
						<img
							alt={'Starting Position Tool'}
							src={'/static/assets/tools/star.png'} />
					</Button>

					<Button
						isAffirmative={tool === 'destination'}
						isUniformlyPadded
						onClick={activateDestinationTool}>
						<img
							alt={'Destination Tool'}
							src={'/static/assets/tools/flag.png'} />
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

		{
			title: 'Pathfinding Grid',
			children: (
				<Switch
					isOn={isPathfindingGridVisible}
					onChange={handleShowPathfindingGridChange} />
			),
		},

		{
			title: 'Starting Position',
			children: (
				<Switch
					isOn={(tool === 'startingPosition') || isStartingPositionVisible}
					onChange={handleShowStartingPositionChange} />
			),
		},
	]

	useEffect(() => {
		activateMoveTool()
	}, [activateMoveTool])

	return (
		<EditorContainer>
			<Editor
				showMapGrid
				showTransparencyGrid={false} />

			<EditorControls controls={controls} />
		</EditorContainer>
	)
}
