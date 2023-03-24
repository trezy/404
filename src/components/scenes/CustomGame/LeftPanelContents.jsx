// Module imports
import { useEffect } from 'react'





// Local imports
import {
	MAIN_MENU,
	SETTINGS,
} from '../../../constants/SceneNames.js'
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { PanelMenu } from '../../Panel/PanelMenu.jsx'
import { popScene } from '../../../newStore/helpers/popScene.js'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { useNavGraphContext } from '../../NavGraph/NavGraphContextProvider.jsx'





function handleBackClick() {
	popScene()
}

function handleMainMenuClick() {
	pushScene(MAIN_MENU)
}

function handleSettingsClick() {
	pushScene(SETTINGS)
}

/**
 * Renders the contents of the left panel for the Custom Game scene.
 */
export function LeftPanelContents() {
	const { focusNode } = useNavGraphContext()

	useEffect(() => {
		focusNode('main menu')
	}, [focusNode])

	return (
		<PanelMenu>
			<ButtonStack>
				<Button
					nodeID={'main menu'}
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					onActivate={handleMainMenuClick}
					onClick={handleMainMenuClick}>
					{'Main Menu'}
				</Button>

				<Button
					nodeID={'settings'}
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					onActivate={handleSettingsClick}
					onClick={handleSettingsClick}>
					{'Settings'}
				</Button>

				<Button
					nodeID={'back'}
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					onActivate={handleBackClick}
					onClick={handleBackClick}>
					{'Back'}
				</Button>
			</ButtonStack>
		</PanelMenu>
	)
}
