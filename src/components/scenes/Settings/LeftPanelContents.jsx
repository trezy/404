// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the left panel for the Settings scene.
 */
export function LeftPanelContents() {
	const [
		goBack,
		goToSettingsPanel,
		settingsPanel,
	] = useStore(state => [
		state.goBack,
		state.goToSettingsPanel,
		state.settingsPanel,
	])

	const showAccessibilityPanel = useCallback(() => goToSettingsPanel('accessibility'), [goToSettingsPanel])
	const showControlsPanel = useCallback(() => goToSettingsPanel('controls'), [goToSettingsPanel])
	const showGraphicsPanel = useCallback(() => goToSettingsPanel('graphics'), [goToSettingsPanel])
	const showSoundPanel = useCallback(() => goToSettingsPanel('sound'), [goToSettingsPanel])


	return (
		<ButtonStack className={'panel-bottom'}>
			<Button
				isPrimary={settingsPanel === 'graphics'}
				onClick={showGraphicsPanel}>
				{'Graphics'}
			</Button>

			<Button
				isPrimary={settingsPanel === 'sound'}
				onClick={showSoundPanel}>
				{'Sound'}
			</Button>

			<Button
				isPrimary={settingsPanel === 'controls'}
				onClick={showControlsPanel}>
				{'Controls'}
			</Button>

			<Button
				isPrimary={settingsPanel === 'accessibility'}
				onClick={showAccessibilityPanel}>
				{'Accessibility'}
			</Button>

			<Button onClick={goBack}>
				{'Back'}
			</Button>
		</ButtonStack>
	)
}
