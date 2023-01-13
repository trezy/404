// Module imports
import { motion } from 'framer-motion'





// Local imports
import { EditorContextProvider } from '../scenes/Architect/context/EditorContext.jsx'
import { KeyStateContextProvider } from '../scenes/Architect/context/KeyStateContext.jsx'
import { LeftPanelContainer } from './LeftPanelContainer/LeftPanelContainer.jsx'
import { MapEditorCanvas } from './MapEditorCanvas.jsx'
import { ResourcepackEditorContextProvider } from '../scenes/Architect/context/ResourcepackEditorContext.jsx'





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
export function MapEditor() {
	return (
		<motion.main
			animate={'animate'}
			className={'map-editor'}
			exit={'exit'}
			initial={'initial'}
			variants={VARIANTS}>
			<ResourcepackEditorContextProvider>
				<EditorContextProvider>
					<KeyStateContextProvider>
						<LeftPanelContainer />

						<MapEditorCanvas />
					</KeyStateContextProvider>
				</EditorContextProvider>
			</ResourcepackEditorContextProvider>
		</motion.main>
	)
}
