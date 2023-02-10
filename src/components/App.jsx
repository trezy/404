// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import { AnimatePresence } from 'framer-motion'





// Local imports
import {
	ARCHITECT,
	LOADING_GAME,
} from '../constants/SceneNames.js'
import { Architect } from './scenes/Architect/Architect.jsx'
import { executePromiseWithMinimumDuration } from '../helpers/executePromiseWithMinimumDuration.js'
import { ipcRenderer } from 'electron'
import { LoadingGameScene } from './scenes/LoadingGameScene/LoadingGameScene.jsx'
import { MainScene } from './scenes/MainScene/MainScene.jsx'
import { ModalPortal } from './ModalPortal/ModalPortal.jsx'
import { useConfigWatcher } from '../hooks/useConfigWatcher.js'
import { useStore } from '../store/react.js'
import { WholePixelContainer } from './WholePixelContainer/WholePixelContainer.jsx'





// Constants
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

	const initialiseFilesystem = useCallback(() => {
		return ipcRenderer
			.invoke('initialiseDirectories')
			.then(() => {
				return contentManager.loadMeta()
			})
	}, [contentManager])

	useEffect(() => {
		if (scene === LOADING_GAME) {
			executePromiseWithMinimumDuration(initialiseFilesystem, MINIMUM_DURATION)
				.then(() => {
					return goToMainMenu()
				})
				.catch(error => {
					throw error
				})
		}
	}, [
		goToMainMenu,
		initialiseFilesystem,
		scene,
	])

	return (
		<>
			<WholePixelContainer>
				<AnimatePresence mode={'wait'}>
					{(scene === LOADING_GAME) && (
						<LoadingGameScene />
					)}

					{(scene === ARCHITECT) && (
						<Architect key={'architect'} />
					)}

					{(![LOADING_GAME, ARCHITECT].includes(scene)) && (
						<MainScene />
					)}
				</AnimatePresence>
			</WholePixelContainer>

			<ModalPortal />
		</>
	)
}
