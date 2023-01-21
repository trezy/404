// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { PanelMenu } from '../../Panel/PanelMenu.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the left panel for the Map Select scene.
 */
export function LeftPanelContents() {
	const [
		goToSettings,
		goToMainMenu,
	] = useStore(state => [
		state.goToSettings,
		state.goToMainMenu,
	])

	return (
		<PanelMenu>
			<ButtonStack>
				<Button>
					{'Statistics'}
				</Button>

				<Button onClick={goToSettings}>
					{'Settings'}
				</Button>

				<Button onClick={goToMainMenu}>
					{'Main Menu'}
				</Button>
			</ButtonStack>
		</PanelMenu>
	)
}
