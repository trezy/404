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
					isNodeGroupDefault
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					nodeID={'accessibility'}
					onActivate={showAccessibilityPanel}
					onClick={showAccessibilityPanel}>
					{'Accessibility'}
				</Button>

				<Button
					isAffirmative={currentSettingsPanel === 'controls'}
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					nodeID={'controls'}
					onActivate={showControlsPanel}
					onClick={showControlsPanel}>
					{'Controls'}
				</Button>

				<Button
					isAffirmative={currentSettingsPanel === 'graphics'}
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					nodeID={'graphics'}
					onActivate={showGraphicsPanel}
					onClick={showGraphicsPanel}>
					{'Graphics'}
				</Button>

				<Button
					isAffirmative={currentSettingsPanel === 'sound'}
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					nodeID={'sound'}
					onActivate={showSoundPanel}
					onClick={showSoundPanel}>
					{'Sound'}
				</Button>

				<Button
					nodeGroupID={'left panel'}
					nodeGroupLinks={['center panel']}
					nodeID={'back'}
					onActivate={handleBackClick}
					onClick={handleBackClick}>
					{'Back'}
				</Button>
			</ButtonStack>
		</PanelMenu>
	)
}
