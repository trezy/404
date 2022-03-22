// Module imports
import {
	useCallback,
	useMemo,
} from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonStack } from '../ButtonStack.jsx'
import { GameTitle } from '../GameTitle.jsx'
import { Panel } from '../Panel.jsx'
import { PanelsLayout } from '../layouts/PanelsLayout.jsx'
import { Scene } from '../Scene.jsx'
import { useStore } from '../../store/react.js'





/**
 * Scene component for the main title menu.
 */
export function TitleScene() {
  const [
		goToSaveSelect,
		goToSettings,
		goToMapSelect,
		mostRecentSaveID,
		saveManager,
	] = useStore(state => [
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
		<Scene id={'title'}>
			<PanelsLayout id={'title'}>
				<Panel>
					<h2>{'Menu'}</h2>

					<ButtonStack className={'panel-bottom'}>
						{Boolean(mostRecentSaveID) && (
							<Button
								isPrimary
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
					</ButtonStack>
				</Panel>

				<Panel
					columnSpan={3}
					isCentered>
					<GameTitle />
				</Panel>
			</PanelsLayout>
		</Scene>
	)
}
