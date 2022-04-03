// Local imports
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Settings scene.
 */
export function CenterPanelContents() {
	const [settingsPanel] = useStore(state => [state.settingsPanel])

	return (
		<>
			{(settingsPanel === 'accessibility') && (
				<h2>{'Accessibility'}</h2>
			)}

			{(settingsPanel === 'controls') && (
				<h2>{'Controls'}</h2>
			)}

			{(settingsPanel === 'graphics') && (
				<h2>{'Graphics'}</h2>
			)}

			{(settingsPanel === 'sound') && (
				<h2>{'Sound'}</h2>
			)}
		</>
	)
}
