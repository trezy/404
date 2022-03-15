// Local imports
import { GameTitle } from '../GameTitle.jsx'





export function LoadingGameScene() {
	return (
		<main
			className="scene"
			id="loading-game">
			<GameTitle />
			<p>{'loading...'}</p>
		</main>
	)
}
