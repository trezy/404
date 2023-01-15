// Local imports
import styles from './EditorControls.module.scss'

import { Button } from '../../Button.jsx'
import { useEditor } from '../../scenes/Architect/context/EditorContext.jsx'





/**
 * Renders a canvas for painting tiles to build a map.
 */
export function EditorControls() {
	const {
		activateBrushTool,
		activateEraserTool,
		activateHandTool,
		activateMarqueeTool,
		defaultZoom,
		tool,
		zoom,
		zoomIn,
		zoomOut,
	} = useEditor()

	return (
		<menu
			className={'editor-controls'}
			type={'toolbar'}>
			<div className={'control'}>
				<label>{'Tools'}</label>

				<div className={'button-group'}>
					<Button
						isAffirmative={tool === 'hand'}
						isUniformlyPadded
						onClick={activateHandTool}>
						<img
							alt={'Hand Tool'}
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
