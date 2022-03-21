// Local imports
import { SceneManager } from './SceneManager.jsx'
import { WholePixelContainer } from './WholePixelContainer.jsx'





/**
 * The main application wrapper.
 */
export function App() {
	return (
		<WholePixelContainer>
			<SceneManager />
		</WholePixelContainer>
	)
}
