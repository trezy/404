// Module imports
import { useEffect } from 'react'
import { useStore } from 'statery'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonStack } from '../ButtonStack/ButtonStack.jsx'
import { hidePauseModal } from '../../newStore/helpers/hidePauseModal.js'
import { MAIN_MENU } from '../../constants/SceneNames.js'
import { Modal } from '../Modal/Modal.jsx'
import { pushScene } from '../../newStore/helpers/pushScene.js'
import { store } from '../../newStore/store.js'
import { useNavGraphContext } from '../NavGraph/NavGraphContextProvider.jsx'





function handleActivateContinue() {
	hidePauseModal()
}

function handleActivateRestartLevel() {
}

function handleActivateQuitToMainMenu() {
	pushScene(MAIN_MENU)
}

function handleActivateQuitToDesktop() {
}

export function PauseModal() {
	const { isPauseModalVisible } = useStore(store)

	const { focusNode } = useNavGraphContext()

	useEffect(() => {
		if (isPauseModalVisible) {
			focusNode('continue')
		}
	}, [
		focusNode,
		isPauseModalVisible,
	])

	if (!isPauseModalVisible) {
		return null
	}

	return (
		<Modal title={'Game Paused'}>
			<ButtonStack>
				<Button
					nodeGroupID={'pause menu'}
					nodeID={'continue'}
					onActivate={handleActivateContinue}
					onClick={handleActivateContinue}>
					{'Continue'}
				</Button>

				<Button
					nodeGroupID={'pause menu'}
					nodeID={'restart'}
					onActivate={handleActivateRestartLevel}
					onClick={handleActivateRestartLevel}>
					{'Restart Level'}
				</Button>

				<Button
					nodeGroupID={'pause menu'}
					nodeID={'main menu'}
					onActivate={handleActivateQuitToMainMenu}
					onClick={handleActivateQuitToMainMenu}>
					{'Quit to Main Menu'}
				</Button>

				<Button
					nodeGroupID={'pause menu'}
					nodeID={'exit'}
					onActivate={handleActivateQuitToDesktop}
					onClick={handleActivateQuitToDesktop}>
					{'Quit to Desktop'}
				</Button>
			</ButtonStack>
		</Modal>
	)
}
