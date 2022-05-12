// Module imports
import {
	useCallback,
	useMemo,
} from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the left panel for the Title scene.
 */
export function LeftPanelContents() {
  const [
		goToArchitect,
		goToSaveSelect,
		goToSettings,
		goToMapSelect,
		mostRecentSaveID,
		saveManager,
	] = useStore(state => [
    state.goToArchitect,
		state.goToSaveSelect,
    state.goToSettings,
    state.goToMapSelect,
    state.mostRecentSaveID,
    state.saveManager,
  ])

	const hasSaves = useMemo(() => {
		return Boolean(saveManager.getAllSaves().length)
	}, [saveManager])

	const handleContinueClick = useCallback(() => {
		goToMapSelect(mostRecentSaveID)
	}, [
		goToMapSelect,
		mostRecentSaveID,
	])

	const handleLoadGameClick = useCallback(() => {
		goToSaveSelect()
	}, [goToSaveSelect])

	const handleNewGameClick = useCallback(() => {
		goToMapSelect()
	}, [goToMapSelect])

	const handleSettingsClick = useCallback(() => {
		goToSettings()
	}, [goToSettings])

	return (
		<ButtonStack className={'panel-bottom'}>
			{Boolean(mostRecentSaveID) && (
				<Button
					isAffirmative
					onClick={handleContinueClick}>
					{'Continue'}
				</Button>
			)}

			<Button onClick={handleNewGameClick}>
				{'New Game'}
			</Button>

			{hasSaves && (
				<Button onClick={handleLoadGameClick}>
					{'Load Game'}
				</Button>
			)}

			<Button onClick={handleSettingsClick}>
				{'Settings'}
			</Button>

			<Button onClick={goToArchitect}>
				{'The Architect'}
			</Button>
		</ButtonStack>
	)
}
