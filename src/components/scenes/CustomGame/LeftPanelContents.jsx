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
					navGroupID={'left panel'}
					navGroupLinks={['center panel']}
					nodeID={'main menu'}
					onActivate={handleMainMenuClick}
					onClick={handleMainMenuClick}>
					{'Main Menu'}
				</Button>

				<Button
					navGroupID={'left panel'}
					navGroupLinks={['center panel']}
					nodeID={'settings'}
					onActivate={handleSettingsClick}
					onClick={handleSettingsClick}>
					{'Settings'}
				</Button>

				<Button
					navGroupID={'left panel'}
					navGroupLinks={['center panel']}
					nodeID={'back'}
					onActivate={handleBackClick}
					onClick={handleBackClick}>
					{'Back'}
				</Button>
			</ButtonStack>
		</PanelMenu>
	)
}
