// Module imports
import {
	useCallback,
	useState,
} from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonStack } from '../ButtonStack.jsx'
import { Panel } from '../Panel.jsx'
import { PanelsLayout } from '../layouts/PanelsLayout.jsx'
import { Scene } from '../Scene.jsx'
import { useStore } from '../../store/react.js'





export function SettingsScene() {
	const [currentPanel, setCurrentPanel] = useState('graphics')

	const showAccessibilityPanel = useCallback(() => setCurrentPanel('accessibility'), [setCurrentPanel])
	const showGraphicsPanel = useCallback(() => setCurrentPanel('graphics'), [setCurrentPanel])
	const showSoundPanel = useCallback(() => setCurrentPanel('sound'), [setCurrentPanel])

	const [goToTitle] = useStore(state => [state.goToTitle])

	return (
		<Scene id="title">
			<PanelsLayout id="title">
				<Panel>
					<h2>{'Menu'}</h2>

					<ButtonStack className="panel-bottom">
						<Button
							onClick={showGraphicsPanel}
							isPrimary={currentPanel === 'graphics'}>
							{'Graphics'}
						</Button>

						<Button
							onClick={showSoundPanel}
							isPrimary={currentPanel === 'sound'}>
							{'Sound'}
						</Button>

						<Button
							onClick={showAccessibilityPanel}
							isPrimary={currentPanel === 'accessibility'}>
							{'Accessibility'}
						</Button>

						<Button onClick={goToTitle}>
							{'Back'}
						</Button>
					</ButtonStack>
				</Panel>

				<Panel columnSpan={3}>
					{(currentPanel === 'graphics') && (
						'Graphics'
					)}

					{(currentPanel === 'sound') && (
						'Sound'
					)}
					{(currentPanel === 'accessibility') && (
						'Accessibility'
					)}
				</Panel>
			</PanelsLayout>
		</Scene>
	)
}
