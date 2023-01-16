// Module imports
import {
	AnimatePresence,
	motion,
} from 'framer-motion'
import { useEffect } from 'react'





// Local imports
import {
	ARCHITECT,
	LOADING_GAME,
} from '../constants/SceneNames.js'
import { Architect } from './scenes/Architect/Architect.jsx'
import { CenterPanel } from './CenterPanel.jsx'
import { GameTitle } from './GameTitle/GameTitle.jsx'
import { ipcRenderer } from 'electron'
import { LeftPanel } from './LeftPanel.jsx'
import { ModalPortal } from './ModalPortal/ModalPortal.jsx'
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
const MINIMUM_DURATION = 2000





/**
 * The main application wrapper.
 */
export function App() {
	const [
		contentManager,
		goToMainMenu,
		scene,
	] = useStore(state => [
		state.contentManager,
		state.goToMainMenu,
		state.scene,
	])

	useConfigWatcher()

	useEffect(() => {
		if (scene === LOADING_GAME) {
			const startedAt = performance.now()

			let timeoutID = null

			ipcRenderer
				.invoke('initialiseDirectories')
				.then(() => {
					return contentManager.loadMeta()
				})
				.then(() => {
					const loadingDuration = performance.now() - startedAt

					return new Promise(resolve => {
						if (loadingDuration < MINIMUM_DURATION) {
							timeoutID = setTimeout(() => {
								goToMainMenu()
								resolve()
							}, MINIMUM_DURATION - loadingDuration)
						}
					})
				})
				.catch(error => {
					throw error
				})

			return () => clearTimeout(timeoutID)
		}
	}, [
		contentManager,
		scene,
		goToMainMenu,
	])

	return (
		<>
			<WholePixelContainer>
				<AnimatePresence mode={'wait'}>
					{(scene === LOADING_GAME) && (
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

					{(scene === ARCHITECT) && (
						<Architect key={'architect'} />
					)}

					{(![LOADING_GAME, ARCHITECT].includes(scene)) && (
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

			<ModalPortal />
		</>
	)
}
