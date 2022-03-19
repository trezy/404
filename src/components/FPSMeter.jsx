// Module imports
import {
	animate,
	useMotionValue,
} from 'framer-motion'
import {
	useEffect,
	useRef,
} from 'react'





// Local imports
import { useStore } from '../store/react.js'





export function FPSMeter() {
	const fps = useStore(state => state.fps)
	const fpsMotionValue = useMotionValue(0)
	const fpsRef = useRef()

	useEffect(() => {
		const controls = animate(fpsMotionValue, fps, {
			onUpdate(value) {
				if (fpsRef.current) {
					fpsRef.current.textContent = parseInt(String(value))
				}
			}
		})
		return () => controls.stop()
	}, [fps])

	return (
		<div className="fps-meter">
			<var ref={fpsRef} />
			{' FPS'}
		</div>
	)
}
