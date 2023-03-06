// Local imports
import {
	MAIN_MENU,
	SETTINGS,
} from '../../../constants/SceneNames.js'
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { PanelMenu } from '../../Panel/PanelMenu.jsx'
import { pushScene } from '../../../newStore/helpers/pushScene.js'





function handleMainMenuClick() {
	pushScene(MAIN_MENU)
}

function handleSettingsClick() {
	pushScene(SETTINGS)
}

/**
 * Renders the contents of the left panel for the Map Select scene.
 */
export function LeftPanelContents() {
	return (
		<PanelMenu>
			<ButtonStack>
				<Button>
					{'Statistics'}
				</Button>

				<Button onClick={handleSettingsClick}>
					{'Settings'}
				</Button>

				<Button onClick={handleMainMenuClick()}>
					{'Main Menu'}
				</Button>
			</ButtonStack>
		</PanelMenu>
	)
}
