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
		currentSettingsPanel,
		goToSettingsPanel,
		goToTitle,
	] = useStore(state => [
		state.currentSettingsPanel,
		state.goToSettingsPanel,
		state.goToTitle,
	])

	const showAccessibilityPanel = useCallback(() => goToSettingsPanel('accessibility'), [goToSettingsPanel])
	const showGraphicsPanel = useCallback(() => goToSettingsPanel('graphics'), [goToSettingsPanel])
	const showSoundPanel = useCallback(() => goToSettingsPanel('sound'), [goToSettingsPanel])


	return (
		<ButtonStack className={'panel-bottom'}>
			<Button
				isPrimary={currentSettingsPanel === 'graphics'}
				onClick={showGraphicsPanel}>
				{'Graphics'}
			</Button>

			<Button
				isPrimary={currentSettingsPanel === 'sound'}
				onClick={showSoundPanel}>
				{'Sound'}
			</Button>

			<Button
				isPrimary={currentSettingsPanel === 'accessibility'}
				onClick={showAccessibilityPanel}>
				{'Accessibility'}
			</Button>

			<Button onClick={goToTitle}>
				{'Back'}
			</Button>
		</ButtonStack>
	)
}
