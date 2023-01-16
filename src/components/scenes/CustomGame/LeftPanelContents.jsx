// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the left panel for the Custom Game scene.
 */
export function LeftPanelContents() {
  const [
		goBack,
		goToMainMenu,
		goToSettings,
	] = useStore(state => ([
		state.goBack,
		state.goToMainMenu,
		state.goToSettings,
	]))

	const handleBackClick = useCallback(() => {
		goBack()
	}, [goBack])

	const handleMainMenuClick = useCallback(() => {
		goToMainMenu()
	}, [goToMainMenu])

	const handleSettingsClick = useCallback(() => {
		goToSettings()
	}, [goToSettings])

	return (
		<ButtonStack className={'panel-bottom'}>
			<Button onClick={handleMainMenuClick}>
				{'Main Menu'}
			</Button>

			<Button onClick={handleSettingsClick}>
				{'Settings'}
			</Button>

			<Button onClick={handleBackClick}>
				{'Back'}
			</Button>
		</ButtonStack>
	)
}
