// Module imports
import { useEffect } from 'react'





// Local imports
import { GameTitle } from '../GameTitle.jsx'
import { Scene } from '../Scene.jsx'
import { useStore } from '../../store/react.js'





/**
 * Scene component to display while the game is being loaded.
 */
export function LoadingGameScene() {
	const [goToTitle] = useStore(state => [state.goToTitle])

	useEffect(() => {
		const timeoutID = setTimeout(goToTitle, 2000)

		return () => clearTimeout(timeoutID)
	}, [goToTitle])

	return (
		<Scene id={'loading-game'}>
			<GameTitle />
			<p>{'loading...'}</p>
		</Scene>
	)
}
