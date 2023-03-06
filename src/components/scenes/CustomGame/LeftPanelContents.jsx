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
	return (
		<PanelMenu>
			<ButtonStack>
				<Button onClick={handleMainMenuClick}>
					{'Main Menu'}
				</Button>

				<Button onClick={handleSettingsClick}>
					{'Settings'}
				</Button>

				<Button onClick={handleBackClick}>
					{'Back'}
				</Button>
			</ButtonStack>
		</PanelMenu>
	)
}
