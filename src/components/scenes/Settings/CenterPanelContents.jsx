// Local imports
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Settings scene.
 */
export function CenterPanelContents() {
	const [currentSettingsPanel] = useStore(state => [state.currentSettingsPanel])

	return (
		<>
			{(currentSettingsPanel === 'graphics') && (
				'Graphics'
			)}

			{(currentSettingsPanel === 'sound') && (
				'Sound'
			)}

			{(currentSettingsPanel === 'accessibility') && (
				'Accessibility'
			)}
		</>
	)
}
