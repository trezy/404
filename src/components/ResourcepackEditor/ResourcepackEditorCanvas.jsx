// Module imports
import { useMemo } from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonGroup } from '../ButtonGroup/ButtonGroup.jsx'
import { Editor } from '../Editor/Editor.jsx'
import { EditorContainer } from '../EditorContainer/EditorContainer.jsx'
import { EditorControls } from '../EditorControls/EditorControls.jsx'
import { OpenItemTabs } from './OpenItemTabs.jsx'
import { useEditorContext } from '../Editor/Context/useEditorContext.js'
import { useResourcepackEditorContext } from './Context/useResourcepackEditorContext.js'





export function ResourcepackEditorCanvas() {
	const {
		activateMarqueeTool,
		activateMoveTool,
		defaultZoom,
		focusedItemID,
		tool,
		zoom,
		zoomIn,
		zoomOut,
	} = useEditorContext()
	const { assets } = useResourcepackEditorContext()

	const asset = useMemo(() => assets[focusedItemID], [
		assets,
		focusedItemID,
	])

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
						isAffirmative={tool === 'marquee'}
						isUniformlyPadded
						onClick={activateMarqueeTool}>
						<img
							alt={'Selection Tool'}
							src={'/static/assets/tools/marquee.png'} />
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

	return (
		<EditorContainer>
			<OpenItemTabs />

			<Editor image={asset?.image} />

			<EditorControls controls={controls} />
		</EditorContainer>
	)
}
