// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { useStore } from '../../../store/react.js'
import { useUIStore } from '../../../store/ui.js'





/**
 * Renders the contents of the left panel for the Title scene.
 */
export function LeftPanelContents() {
  const [
		goToArchitect,
		goToSettings,
	] = useStore(state => [
    state.goToArchitect,
    state.goToSettings,
  ])

	const [
		isCampaignMenuVisible,
		isCustomGameMenuVisible,
		showCampaignMenu,
		showCustomGameMenu,
	] = useUIStore(state => {
		return [
			state.titleState.isCampaignMenuVisible,
			state.titleState.isCustomGameMenuVisible,
			state.titleState.showCampaignMenu,
			state.titleState.showCustomGameMenu,
		]
	})

	const handleCampaignClick = useCallback(() => {
		showCampaignMenu()
	}, [showCampaignMenu])

	const handleCustomGameClick = useCallback(() => {
		showCustomGameMenu()
	}, [showCustomGameMenu])

	const handleSettingsClick = useCallback(() => {
		goToSettings()
	}, [goToSettings])

	return (
		<ButtonStack className={'panel-bottom'}>
			<Button
				isAffirmative={isCampaignMenuVisible}
				onClick={handleCampaignClick}>
				{'Campaign'}
			</Button>

			<Button
				isAffirmative={isCustomGameMenuVisible}
				onClick={handleCustomGameClick}>
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
