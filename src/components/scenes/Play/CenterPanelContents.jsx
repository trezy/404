// Module imports
import { useEffect } from 'react'
import { useStore } from 'statery'





// Local imports
import { PauseModal } from '../../PauseModal/PauseModal.jsx'
import { store } from '../../../newStore/store.js'
import { togglePauseModal } from '../../../newStore/helpers/togglePauseModal.js'
import { Victory } from '../../Victory/Victory.jsx'





function handleButtonPressed(options) {
	const { index } = options
	if (index === 9) {
		togglePauseModal()
	}
}

/**
 * Renders the contents of the center panel for the Play scene.
 */
export function CenterPanelContents() {
	const {
		controlsManager,
		gameManager,
	}= useStore(store)

	useEffect(() => {
		gameManager.start()
		return () => gameManager.stop()
	}, [gameManager])

	useEffect(() => {
		controlsManager.on('button pressed', handleButtonPressed)

		return () => controlsManager.off('button pressed', handleButtonPressed)
	}, [controlsManager])

	return (
		<>
			<canvas id={'game-canvas'} />

			<Victory />

			<PauseModal />
		</>
	)
}
