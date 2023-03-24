// Module imports
import { useCallback } from 'react'
import { useStore } from 'statery'





// Local imports
import { FPSMeter } from '../../FPSMeter.jsx'
import { MAP_SELECT } from '../../../constants/SceneNames.js'
import { PanelMenu } from '../../Panel/PanelMenu.jsx'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { store } from '../../../newStore/store.js'
import { Timer } from '../../Timer/Timer.jsx'





/**
 * Renders the contents of the left panel for the Play scene.
 */
export function LeftPanelContents() {
	const { gameManager } = useStore(store)

	const handleQuitClick = useCallback(() => {
		gameManager.stop()
		pushScene(MAP_SELECT)
	}, [gameManager])

	return (
		<>
			<Timer
				isBordered
				isCentered
				isLarge
				isMonospace />

			<PanelMenu>
				<FPSMeter />
			</PanelMenu>
		</>
	)
}
