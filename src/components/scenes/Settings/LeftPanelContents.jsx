// Module imports
import { useCallback } from 'react'
import { useStore } from 'statery'





// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { goToSettingsPanel } from '../../../newStore/helpers/goToSettingsPanel.js'
import { PanelMenu } from '../../Panel/PanelMenu.jsx'
import { popScene } from '../../../newStore/helpers/popScene.js'
import { store } from '../../../newStore/store.js'





function handleBackClick() {
	popScene()
}

/**
 * Renders the contents of the left panel for the Settings scene.
 */
export function LeftPanelContents() {
	const { currentSettingsPanel } = useStore(store)

	const showAccessibilityPanel = useCallback(() => goToSettingsPanel('accessibility'), [currentSettingsPanel])
	const showControlsPanel = useCallback(() => goToSettingsPanel('controls'), [currentSettingsPanel])
	const showGraphicsPanel = useCallback(() => goToSettingsPanel('graphics'), [currentSettingsPanel])
	const showSoundPanel = useCallback(() => goToSettingsPanel('sound'), [currentSettingsPanel])

	return (
		<PanelMenu>
			<ButtonStack>
				<Button
					isAffirmative={currentSettingsPanel === 'accessibility'}
					onClick={showAccessibilityPanel}>
					{'Accessibility'}
				</Button>

				<Button
					isAffirmative={currentSettingsPanel === 'controls'}
					onClick={showControlsPanel}>
					{'Controls'}
				</Button>

				<Button
					isAffirmative={currentSettingsPanel === 'graphics'}
					onClick={showGraphicsPanel}>
					{'Graphics'}
				</Button>

				<Button
					isAffirmative={currentSettingsPanel === 'sound'}
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
