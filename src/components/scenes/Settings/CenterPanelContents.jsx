// Module imports
import { AnimatePresence } from 'framer-motion'





// Local imports
import { AccessibilitySettings } from './AccessibilitySettings.jsx'
import { ControlsSettings } from './ControlsSettings.jsx'
import { GraphicsSettings } from './GraphicsSettings.jsx'
import { SoundSettings } from './SoundSettings.jsx'
import { useStore } from '../../../store/react.js'





// Constants
const VARIANTS = {
	animate: {
		opacity: 1,
		x: 1,
		transition: {
			damping: 30,
			stiffness: 500,
			type: 'spring',
		},
	},

	exit: {
		opacity: 0,
		x: '100%',
		transition: {
			damping: 30,
			stiffness: 500,
			type: 'spring',
		},
	},

	initial: {
		opacity: 0,
		x: '-100%',
		transition: {
			damping: 30,
			stiffness: 500,
			type: 'spring',
		},
	},
}





/**
 * Renders the contents of the center panel for the Settings scene.
 */
export function CenterPanelContents() {
	const [settingsPanel] = useStore(state => [state.settingsPanel])

	return (
		<AnimatePresence
			exitBeforeEnter
			initial={false}>
			{(settingsPanel === 'accessibility') && (
				<AccessibilitySettings
					key={'accessibility'}
					variants={VARIANTS} />
			)}

			{(settingsPanel === 'controls') && (
				<ControlsSettings
					key={'controls'}
					variants={VARIANTS} />
				)}

			{(settingsPanel === 'graphics') && (
				<GraphicsSettings
					key={'graphics'}
					variants={VARIANTS} />
			)}

			{(settingsPanel === 'sound') && (
				<SoundSettings
					key={'sound'}
					variants={VARIANTS} />
			)}
		</AnimatePresence>
	)
}
