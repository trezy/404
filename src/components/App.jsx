// Module imports
import { AnimatePresence } from 'framer-motion'
import { useStore } from 'statery'





// Local imports
import {
	ARCHITECT,
	LOADING_GAME,
} from '../constants/SceneNames.js'
import { Architect } from './scenes/Architect/Architect.jsx'
import { getCurrentScene } from '../newStore/selectors/getCurrentScene.js'
import { LoadingGameScene } from './scenes/LoadingGameScene/LoadingGameScene.jsx'
import { MainScene } from './scenes/MainScene/MainScene.jsx'
import { ModalPortal } from './ModalPortal/ModalPortal.jsx'
import { NavGraphContextProvider } from './NavGraph/NavGraphContextProvider.jsx'
import { store } from '../newStore/store.js'
import { useConfigWatcher } from '../hooks/useConfigWatcher.js'
import { WholePixelContainer } from './WholePixelContainer/WholePixelContainer.jsx'





/**
 * The main application wrapper.
 */
export function App() {
	const proxyStore = useStore(store)
	const currentScene = getCurrentScene(proxyStore)

	useConfigWatcher()

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
