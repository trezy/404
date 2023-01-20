// Local imports
import { Button } from '../../Button.jsx'
import { useEditorContext } from '../../Editor/Context/useEditorContext.js'




export function EditorControls() {
	const {
		activateMarqueeTool,
		activateMoveTool,
		defaultZoom,
		tool,
		zoom,
		zoomIn,
		zoomOut,
	} = useEditorContext()

	return (
		<menu
			className={'editor-controls'}
			type={'toolbar'}>
			<div className={'control'}>
				<label>{'Tools'}</label>

				<div className={'button-group'}>
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
				</div>
			</div>

			<div className={'control'}>
				<label>{'Zoom'}</label>

				<div className={'button-group'}>
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
				</div>
			</div>
		</menu>
	)
}
