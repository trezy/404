// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { PanelMenu } from '../../Panel/PanelMenu.jsx'
import { popScene } from '../../../newStore/helpers/popScene.js'
import { useStore } from '../../../store/react.js'





function handleBackClick() {
	popScene()
}

/**
 * Renders the contents of the left panel for the Settings scene.
 */
export function LeftPanelContents() {
	const [
		goToSettingsPanel,
		settingsPanel,
	] = useStore(state => [
		state.goToSettingsPanel,
		state.settingsPanel,
	])

	const showAccessibilityPanel = useCallback(() => goToSettingsPanel('accessibility'), [goToSettingsPanel])
	const showControlsPanel = useCallback(() => goToSettingsPanel('controls'), [goToSettingsPanel])
	const showGraphicsPanel = useCallback(() => goToSettingsPanel('graphics'), [goToSettingsPanel])
	const showSoundPanel = useCallback(() => goToSettingsPanel('sound'), [goToSettingsPanel])

	return (
		<PanelMenu>
			<ButtonStack>
				<Button
					isAffirmative={settingsPanel === 'accessibility'}
					onClick={showAccessibilityPanel}>
					{'Accessibility'}
				</Button>

				<Button
					isAffirmative={settingsPanel === 'controls'}
					onClick={showControlsPanel}>
					{'Controls'}
				</Button>

				<Button
					isAffirmative={settingsPanel === 'graphics'}
					onClick={showGraphicsPanel}>
					{'Graphics'}
				</Button>

				<Button
					isAffirmative={settingsPanel === 'sound'}
					onClick={showSoundPanel}>
					{'Sound'}
				</Button>

				<Button onClick={handleBackClick}>
					{'Back'}
				</Button>
			</ButtonStack>
		</PanelMenu>
	)
}
