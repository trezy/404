// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import { AnimatePresence } from 'framer-motion'
import { useStore } from 'statery'





// Local imports
import {
	ARCHITECT,
	LOADING_GAME,
	MAIN_MENU,
} from '../constants/SceneNames.js'
import { Architect } from './scenes/Architect/Architect.jsx'
import { executePromiseWithMinimumDuration } from '../helpers/executePromiseWithMinimumDuration.js'
import { getCurrentScene } from '../newStore/selectors/getCurrentScene.js'
import { ipcRenderer } from 'electron'
import { LoadingGameScene } from './scenes/LoadingGameScene/LoadingGameScene.jsx'
import { MainScene } from './scenes/MainScene/MainScene.jsx'
import { ModalPortal } from './ModalPortal/ModalPortal.jsx'
import { NavGraphContextProvider } from './NavGraph/NavGraphContextProvider.jsx'
import { pushScene } from '../newStore/helpers/pushScene.js'
import { store } from '../newStore/store.js'
import { useConfigWatcher } from '../hooks/useConfigWatcher.js'
import { WholePixelContainer } from './WholePixelContainer/WholePixelContainer.jsx'





// Constants
const MINIMUM_DURATION = 2000





/**
 * The main application wrapper.
 */
export function App() {
	const proxyStore = useStore(store)
	const currentScene = getCurrentScene(proxyStore)

	const { contentManager } = proxyStore

	useConfigWatcher()

	const initialiseFilesystem = useCallback(() => {
		return ipcRenderer
			.invoke('initialiseDirectories')
			.then(() => {
				return contentManager.loadMeta()
			})
	}, [contentManager])

	useEffect(() => {
		if (currentScene === LOADING_GAME) {
			executePromiseWithMinimumDuration(initialiseFilesystem, MINIMUM_DURATION)
				.then(() => pushScene(MAIN_MENU))
				.catch(error => {
					throw error
				})
		}
	}, [
		initialiseFilesystem,
		currentScene,
	])

	return (
		<>
			<NavGraphContextProvider>
				<WholePixelContainer>
					<AnimatePresence mode={'wait'}>
						{(currentScene === LOADING_GAME) && (
							<LoadingGameScene />
						)}

						{(currentScene === ARCHITECT) && (
							<Architect key={'architect'} />
						)}

						{(![LOADING_GAME, ARCHITECT].includes(currentScene)) && (
							<MainScene />
						)}
					</AnimatePresence>
				</WholePixelContainer>
			</NavGraphContextProvider>

			<ModalPortal />
		</>
	)
}
