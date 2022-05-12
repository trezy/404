// Module imports
// import { useRef } from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { useEditor } from './context/EditorContext.jsx'
// import { useKeyState } from './context/KeyStateContext.jsx'




export function EditorControls() {
	const {
		activateHandTool,
		activateMarqueeTool,
		defaultZoom,
		// setScale,
		tool,
		zoom,
		zoomIn,
		zoomOut,
	} = useEditor()
	// const canvasRef = useRef(null)

	// useEffect(() => {
	//	preventDefaultForKey(['meta', '+'])
	//	preventDefaultForKey(['meta', 'shift', '='])
	//	preventDefaultForKey(['meta', '-'])

	//	if (keyState['meta']) {
	//		if (keyState['-']) {
	//			setScale(previousScale => previousScale - 0.5)
	//		} else if (keyState['+'] || (keyState['shift'] &&	 keyState['='])) {
	//			setScale(previousScale => previousScale + 0.5)
	//		}
	//	}

	//	// removeKeysFromPreventDefault
	// }, [
	//	keyState,
	//	preventDefaultForKey,
	//	setScale,
	// ])

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
						{'Hand'}
					</Button>

					<Button
						isAffirmative={tool === 'marquee'}
						isUniformlyPadded
						onClick={activateMarqueeTool}>
						{'Marquee'}
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
