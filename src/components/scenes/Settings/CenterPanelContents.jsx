// Module imports
import { AnimatePresence } from 'framer-motion'
import { useStore } from 'statery'





// Local imports
import { AccessibilitySettings } from './AccessibilitySettings.jsx'
import { ControlsSettings } from './ControlsSettings.jsx'
import { GraphicsSettings } from './GraphicsSettings.jsx'
import { SoundSettings } from './SoundSettings.jsx'
import { store } from '../../../newStore/store.js'





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
	const { currentSettingsPanel } = useStore(store)

	return (
		<AnimatePresence
			initial={false}
			mode={'wait'}>
			{(currentSettingsPanel === 'accessibility') && (
				<AccessibilitySettings
					key={'accessibility'}
					variants={VARIANTS} />
			)}

			{(currentSettingsPanel === 'controls') && (
				<ControlsSettings
					key={'controls'}
					variants={VARIANTS} />
				)}

			{(currentSettingsPanel === 'graphics') && (
				<GraphicsSettings
					key={'graphics'}
					variants={VARIANTS} />
			)}

			{(currentSettingsPanel === 'sound') && (
				<SoundSettings
					key={'sound'}
					variants={VARIANTS} />
			)}
		</AnimatePresence>
	)
}
