// Module imports
import {
	AnimatePresence,
	motion,
} from 'framer-motion'
import { useEffect } from 'react'





// Local imports
import { Architect } from './scenes/Architect/Architect.jsx'
import { CenterPanel } from './CenterPanel.jsx'
import { GameTitle } from './GameTitle.jsx'
import { LeftPanel } from './LeftPanel.jsx'
import { useConfigWatcher } from '../hooks/useConfigWatcher.js'
import { useStore } from '../store/react.js'
import { WholePixelContainer } from './WholePixelContainer.jsx'





// Constants
const LOADING_SCENE_VARIANTS = {
	animate: {
		opacity: 1,
	},

	exit: {
		opacity: 0,
	},

	initial: {
		opacity: 0,
	},
}
const MAIN_SCENE_VARIANTS = {
	animate: {
		opacity: 1,
		transition: {
			duration: 0,
		},
	},

	exit: {
		opacity: 0,
	},

	initial: {
		opacity: 0,
	},
}





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

	useConfigWatcher()

	useEffect(() => {
		if (scene === 'loadingGame') {
			const timeoutID = setTimeout(goToTitle, 2000)

			return () => clearTimeout(timeoutID)
		}
	}, [
		scene,
		goToTitle,
	])

	return (
		<>
			<WholePixelContainer>
				<AnimatePresence exitBeforeEnter>
					{(scene === 'loadingGame') && (
						<motion.main
							key={'loading-game'}
							animate={'animate'}
							className={'scene loading-game'}
							exit={'exit'}
							initial={'initial'}
							variants={LOADING_SCENE_VARIANTS}>
							<GameTitle />
							<p>{'loading...'}</p>
						</motion.main>
					)}

					{(scene === 'architect') && (
						<Architect key={'architect'} />
					)}

					{(!['loadingGame', 'architect'].includes(scene)) && (
						<motion.main
							key={'main'}
							animate={'animate'}
							className={'scene'}
							exit={'exit'}
							initial={'initial'}
							variants={MAIN_SCENE_VARIANTS}>
							<div className={'layout panels'}>
								<LeftPanel />
								<CenterPanel />
							</div>
						</motion.main>
					)}
				</AnimatePresence>
			</WholePixelContainer>

			<div id={'modal-portal'} />
		</>
	)
}
