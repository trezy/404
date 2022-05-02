// Module imports
import { useRef } from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { useEditor } from './context/EditorContext.jsx'
// import { useKeyState } from './context/KeyStateContext.jsx'




export function EditorControls() {
	const {
		setScale,
		zoomIn,
		zoomOut,
	} = useEditor()
	const canvasRef = useRef(null)

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
			<div className={'field'}>
				<label>{'Zoom'}</label>

				<div>
					<Button
						// isSmall
						// isUniformlyPadded
						onClick={zoomIn}>
						{'+'}
					</Button>

					<Button
						// isSmall
						// isUniformlyPadded
						onClick={zoomOut}>
						{'-'}
					</Button>
				</div>
			</div>
		</menu>
	)
}
