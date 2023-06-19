// Module imports
import {
	useEffect,
	useRef,
} from 'react'
import { useStore } from 'statery'





// Local imports
import styles from './CenterPanelContents.module.scss'

import { Console } from '../../Console/Console.jsx'
import { PauseModal } from '../../PauseModal/PauseModal.jsx'
import { store } from '../../../newStore/store.js'
import { togglePauseModal } from '../../../newStore/helpers/togglePauseModal.js'
import { useGameLoop } from '../../../hooks/useGameLoop.js'
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
		pixiApp,
	} = useStore(store)

	const gameWrapperRef = useRef(null)

	useEffect(() => {
		const gameWrapper = gameWrapperRef.current

		if (!gameWrapper) {
			return
		}

		gameWrapper.appendChild(pixiApp.view)
		pixiApp.resizeTo = gameWrapper

		if (!pixiApp.ticker.started) {
			pixiApp.start()
		}
	}, [
		gameWrapperRef,
		pixiApp,
	])

	useEffect(() => {
		controlsManager.on('button pressed', handleButtonPressed)

		return () => controlsManager.off('button pressed', handleButtonPressed)
	}, [controlsManager])

	useGameLoop()

	return (
		<>
			<div
				ref={gameWrapperRef}
				className={styles['game-wrapper']} />

			<Console />

			<Victory />

			<PauseModal />
		</>
	)
}
