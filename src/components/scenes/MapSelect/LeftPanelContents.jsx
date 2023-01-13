// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the left panel for the Map Select scene.
 */
export function LeftPanelContents() {
	const [
		goToSettings,
		goToTitle,
	] = useStore(state => [
		state.goToSettings,
		state.goToTitle,
	])

	return (
		<ButtonStack className={'panel-bottom'}>
			<Button>
				{'Statistics'}
			</Button>

			<Button onClick={goToSettings}>
				{'Settings'}
			</Button>

			<Button onClick={goToTitle}>
				{'Main Menu'}
			</Button>
		</ButtonStack>
	)
}
