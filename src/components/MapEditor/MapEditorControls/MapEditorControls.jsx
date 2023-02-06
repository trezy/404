// Module imports
import { useCallback } from 'react'
import { useStore } from 'statery'





// Local imports
import {
	activateBrushTool,
	activateDestinationTool,
	activateEraserTool,
	activateMoveTool,
	activateStartingPositionTool,
	hideDestinations,
	hidePathfindingGrid,
	hideStartingPosition,
	showDestinations,
	showPathfindingGrid,
	showStartingPosition,
	store,
} from '../store.js'
import { Button } from '../../Button.jsx'
import { ButtonGroup } from '../../ButtonGroup/ButtonGroup.jsx'
import { EditorControls } from '../../EditorControls/EditorControls.jsx'
import { Switch } from '../../Switch/Switch.jsx'





export function MapEditorControls() {
	const {
		isDestinationsVisible,
		isPathfindingGridVisible,
		isStartingPositionVisible,
		tool,
	} = useStore(store)

	const handleBrushToolClick = useCallback(() => activateBrushTool(), [activateBrushTool])

	const handleDestinationToolClick = useCallback(() => activateDestinationTool(), [activateDestinationTool])

	const handleDestinationsVisibilityChange = useCallback(isOn => {
		if (isOn) {
			showDestinations()
		} else {
			hideDestinations()
		}
	}, [
		hideDestinations,
		showDestinations,
	])

	const handleEraserToolClick = useCallback(() => activateEraserTool(), [activateEraserTool])

	const handleMoveToolClick = useCallback(() => activateMoveTool(), [activateMoveTool])

	const handlePathfindingGridVisibilityChange = useCallback(isOn => {
		if (isOn) {
			showPathfindingGrid()
		} else {
			hidePathfindingGrid()
		}
	}, [
		hidePathfindingGrid,
		showPathfindingGrid,
	])

	const handleStartingPositionToolClick = useCallback(() => activateStartingPositionTool(), [activateStartingPositionTool])

	const handleStartingPositionVisibilityChange = useCallback(isOn => {
		if (isOn) {
			showStartingPosition()
		} else {
			hideStartingPosition()
		}
	}, [
		hideStartingPosition,
		showStartingPosition,
	])

	const controls = [
		{
			title: 'Tools',
			children: (
				<ButtonGroup>
					<Button
						isAffirmative={tool === 'move'}
						isUniformlyPadded
						onClick={handleMoveToolClick}>
						<img
							alt={'Move Tool'}
							src={'/static/assets/tools/move.png'} />
					</Button>

					<Button
						isAffirmative={tool === 'eraser'}
						isUniformlyPadded
						onClick={handleEraserToolClick}>
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
						onClick={handleBrushToolClick}>
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
						isAffirmative={tool === 'starting position'}
						isUniformlyPadded
						onClick={handleStartingPositionToolClick}>
						<img
							alt={'Starting Position Tool'}
							src={'/static/assets/tools/star.png'} />
					</Button>

					<Button
						isAffirmative={tool === 'destination'}
						isUniformlyPadded
						onClick={handleDestinationToolClick}>
						<img
							alt={'Destination Tool'}
							src={'/static/assets/tools/flag.png'} />
					</Button>
				</ButtonGroup>
			),
		},

		// {
		// 	title: 'Zoom',
		// 	children: (
		// 		<ButtonGroup>
		// 			<Button
		// 				isUniformlyPadded
		// 				onClick={zoomOut}>
		// 				{'-'}
		// 			</Button>

		// 			<div>
		// 				{`${(zoom - defaultZoom + 1) * 100}%`}
		// 			</div>

		// 			<Button
		// 				isUniformlyPadded
		// 				onClick={zoomIn}>
		// 				{'+'}
		// 			</Button>
		// 		</ButtonGroup>
		// 	),
		// },

		{
			title: 'Pathfinding Grid',
			children: (
				<Switch
					isOn={isPathfindingGridVisible}
					onChange={handlePathfindingGridVisibilityChange} />
			),
		},

		{
			title: 'Starting Position',
			children: (
				<Switch
					isOn={(tool === 'starting position') || isStartingPositionVisible}
					onChange={handleStartingPositionVisibilityChange} />
			),
		},

		{
			title: 'Destinations',
			children: (
				<Switch
					isOn={(tool === 'destination') || isDestinationsVisible}
					onChange={handleDestinationsVisibilityChange} />
			),
		},
	]

	return (
		<EditorControls controls={controls} />
	)
}
