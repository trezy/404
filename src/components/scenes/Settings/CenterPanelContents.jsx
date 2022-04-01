// Local imports
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Settings scene.
 */
export function CenterPanelContents() {
	const [settingsPanel] = useStore(state => [state.settingsPanel])

	return (
		<>
			{(settingsPanel === 'graphics') && (
				'Graphics'
			)}

			{(settingsPanel === 'sound') && (
				'Sound'
			)}

			{(settingsPanel === 'accessibility') && (
				'Accessibility'
			)}
		</>
	)
}
