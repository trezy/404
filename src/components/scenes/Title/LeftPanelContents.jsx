// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the left panel for the Title scene.
 */
export function LeftPanelContents() {
  const [
		goToArchitect,
		goToCustomGame,
		goToSettings,
	] = useStore(state => [
    state.goToArchitect,
    state.goToCustomGame,
    state.goToSettings,
  ])

	const handleCustomGameClick = useCallback(() => {
		goToCustomGame()
	}, [goToCustomGame])

	const handleSettingsClick = useCallback(() => {
		goToSettings()
	}, [goToSettings])

	return (
		<ButtonStack className={'panel-bottom'}>
			<Button onClick={handleCustomGameClick}>
				{'Custom Game'}
			</Button>

			<Button onClick={goToArchitect}>
				{'Architect'}
			</Button>

			<Button onClick={handleSettingsClick}>
				{'Settings'}
			</Button>
		</ButtonStack>
	)
}
