// Module imports
import { useEffect } from 'react'





// Local imports
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Play scene.
 */
export function CenterPanelContents() {
	const [gameManager] = useStore(state => [state.gameManager])

	useEffect(() => {
		gameManager.start()
		return gameManager.stop
	}, [gameManager])

	return (
		<canvas id={'game-canvas'} />
	)
}
