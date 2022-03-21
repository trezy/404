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
	] = useStore(state => [
		state.goToSaveSelect,
    state.goToSettings,
  ])

	return (
		<Scene id={'title'}>
			<PanelsLayout id={'title'}>
				<Panel>
					<h2>{'Menu'}</h2>

					<ButtonStack className={'panel-bottom'}>
						<Button isPrimary>
							{'Continue'}
						</Button>

						<Button>
							{'New Game'}
						</Button>

						<Button onClick={goToSaveSelect}>
							{'Load Game'}
						</Button>

						<Button onClick={goToSettings}>
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
