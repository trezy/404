// Local imports
import {
	ARCHITECT,
	CUSTOM_GAME,
	SETTINGS,
} from '../../../constants/SceneNames.js'
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { PanelMenu } from '../../Panel/PanelMenu.jsx'
import { pushScene } from '../../../newStore/helpers/pushScene.js'





function handleArchitectClick() {
	pushScene(ARCHITECT)
}

function handleCustomGameClick() {
	pushScene(CUSTOM_GAME)
}

function handleSettingsClick() {
	pushScene(SETTINGS)
}

/**
 * Renders the contents of the left panel for the Title scene.
 */
export function LeftPanelContents() {
	return (
		<PanelMenu>
			<ButtonStack>
				<Button
					isNodeGroupDefault
					nodeID={'custom game'}
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					onActivate={handleCustomGameClick}
					onClick={handleCustomGameClick}>
					{'Custom Game'}
				</Button>

				<Button
					nodeID={'architect'}
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					onActivate={handleArchitectClick}
					onClick={handleArchitectClick}>
					{'Architect'}
				</Button>

				<Button
					nodeID={'settings'}
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					onActivate={handleSettingsClick}
					onClick={handleSettingsClick}>
					{'Settings'}
				</Button>
			</ButtonStack>
		</PanelMenu>
	)
}
