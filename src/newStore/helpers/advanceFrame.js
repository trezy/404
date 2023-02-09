// Local imports
import { store } from '../store.js'





// Constants
const FRAME_BUFFER = []





/**
 * Updates the frame buffer and current FPS.
 */
export const advanceFrame = () => {
	const now = performance.now()

	FRAME_BUFFER.push(now)

	const oneSecondAgo = now - 1000
	while (FRAME_BUFFER[0] < oneSecondAgo) {
		FRAME_BUFFER.shift()
	}

	store.set(state => ({
		fps: FRAME_BUFFER.length,
		frame: state.frame + 1,
		time: now,
		timeDelta: now - state.time,
	}))
}
