// Module imports
import {
	useEffect,
	useMemo,
} from 'react'
import classnames from 'classnames'





// Local imports
import { CenterPanel } from './CenterPanel.jsx'
import { GameTitle } from './GameTitle.jsx'
import { LeftPanel } from './LeftPanel.jsx'
import { useStore } from '../store/react.js'
import { WholePixelContainer } from './WholePixelContainer.jsx'





/**
 * The main application wrapper.
 */
export function App() {
	const [
		currentScene,
		goToTitle,
	] = useStore(state => [
		state.currentScene,
		state.goToTitle,
	])

	useEffect(() => {
		if (currentScene === 'loadingGame') {
			const timeoutID = setTimeout(goToTitle, 2000)

			return () => clearTimeout(timeoutID)
		}
	}, [
		currentScene,
		goToTitle,
	])

	const mainElementClassNames = useMemo(() => {
		return classnames('scene', {
			'loading-game': (currentScene === 'loadingGame'),
			'play': (currentScene === 'play'),
		})
	}, [currentScene])

	return (
		<WholePixelContainer>
			<main className={mainElementClassNames}>
				{(currentScene === 'loadingGame') && (
					<>
						<GameTitle />
						<p>{'loading...'}</p>
					</>
				)}

				{(currentScene !== 'loadingGame') && (
					<div className={'layout panels'}>
						<LeftPanel />

						<CenterPanel />
					</div>
				)}
			</main>
		</WholePixelContainer>
	)
}
