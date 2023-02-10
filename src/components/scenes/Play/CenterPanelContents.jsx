// Module imports
import { useEffect } from 'react'
import { useStore } from 'statery'





// Local imports
import { store } from '../../../newStore/store.js'
import { Victory } from '../../Victory/Victory.jsx'
import { useStore as useZustandStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Play scene.
 */
export function CenterPanelContents() {
	const { isVictorious } = useStore(store)

	const [gameManager] = useZustandStore(state => [state.gameManager])

	useEffect(() => {
		gameManager.start()
		return () => gameManager.stop()
	}, [gameManager])

	return (
		<>
			<canvas id={'game-canvas'} />

			{isVictorious && (
				<Victory />
			)}
		</>
	)
}
