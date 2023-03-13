// Module imports
import { useRef } from 'react'





// Local imports
import {
	ARCHITECT,
	CUSTOM_GAME,
	SETTINGS,
} from '../../../constants/SceneNames.js'
import {
	useNavGraph,
	useNavGraphContext,
} from '../../NavGraph/NavGraphContextProvider.jsx'
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
	const architectRef = useRef(null)
	const customGameRef = useRef(null)
	const settingsRef = useRef(null)

	const { currentTargetNodeID } = useNavGraphContext()

	useNavGraph({
		id: 'left panel',
		links: ['center panel'],
		nodes: [
			{
				id: 'custom game',
				isDefault: true,
				onActivate: handleCustomGameClick,
				targetRef: customGameRef,
			},
			{
				id: 'architect',
				onActivate: handleArchitectClick,
				targetRef: architectRef,
			},
			{
				id: 'settings',
				onActivate: handleSettingsClick,
				targetRef: settingsRef,
			},
		],
	})

	return (
		<PanelMenu>
			<ButtonStack>
				<Button
					isGamepadFocused={currentTargetNodeID === 'custom game'}
					onClick={handleCustomGameClick}
					ref={customGameRef}>
					{'Custom Game'}
				</Button>

				<Button
					isGamepadFocused={currentTargetNodeID === 'architect'}
					onClick={handleArchitectClick}
					ref={architectRef}>
					{'Architect'}
				</Button>

				<Button
					isGamepadFocused={currentTargetNodeID === 'settings'}
					onClick={handleSettingsClick}
					ref={settingsRef}>
					{'Settings'}
				</Button>
			</ButtonStack>
		</PanelMenu>
	)
}
