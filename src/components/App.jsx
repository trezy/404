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
		goToTitle,
		scene,
	] = useStore(state => [
		state.goToTitle,
		state.scene,
	])

	useEffect(() => {
		if (scene === 'loadingGame') {
			const timeoutID = setTimeout(goToTitle, 2000)

			return () => clearTimeout(timeoutID)
		}
	}, [
		scene,
		goToTitle,
	])

	const mainElementClassNames = useMemo(() => {
		return classnames('scene', {
			'loading-game': (scene === 'loadingGame'),
			'play': (scene === 'play'),
		})
	}, [scene])

	return (
		<WholePixelContainer>
			<main className={mainElementClassNames}>
				{(scene === 'loadingGame') && (
					<>
						<GameTitle />
						<p>{'loading...'}</p>
					</>
				)}

				{(scene !== 'loadingGame') && (
					<div className={'layout panels'}>
						<LeftPanel />

						<CenterPanel />
					</div>
				)}
			</main>
		</WholePixelContainer>
	)
}
