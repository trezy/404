// Module imports
import { motion } from 'framer-motion'





// Local imports
import { EditorContextProvider } from '../Editor/Context/EditorContextProvider.jsx'
import { KeyStateContextProvider } from '../scenes/Architect/context/KeyStateContext.jsx'
import { LeftPanelContainer } from './LeftPanelContainer/LeftPanelContainer.jsx'
import { ResourcepackEditorCanvas } from './ResourcepackEditorCanvas.jsx'
import { ResourcepackEditorContextProvider } from './Context/ResourcepackEditorContextProvider.jsx'





// Constants
const VARIANTS = {
	animate: {
		opacity: 1,
	},

	exit: {
		opacity: 0,
	},

	initial: {
		opacity: 0,
	},
}





/**
 * Renders the map editor.
 */
export function ResourcepackEditor() {
	return (
		<motion.main
			animate={'animate'}
			className={'asset-pack-creator map-editor'}
			exit={'exit'}
			initial={'initial'}
			variants={VARIANTS}>
			<EditorContextProvider>
				<KeyStateContextProvider>
					<ResourcepackEditorContextProvider>
						<LeftPanelContainer />

						<ResourcepackEditorCanvas />
					</ResourcepackEditorContextProvider>
				</KeyStateContextProvider>
			</EditorContextProvider>
		</motion.main>
	)
}
