// Module imports
import { motion } from 'framer-motion'





// Local imports
import { EditorContextProvider } from '../Editor/Context/EditorContextProvider.jsx'
import { KeyStateContextProvider } from '../scenes/Architect/context/KeyStateContext.jsx'
import { LeftPanelContainer } from './LeftPanelContainer/LeftPanelContainer.jsx'
import { MapEditorContextProvider } from './Context/MapEditorContextProvider.jsx'
import { MapEditorCanvas } from './MapEditorCanvas.jsx'





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
			<EditorContextProvider>
				<KeyStateContextProvider>
					<MapEditorContextProvider>
						<LeftPanelContainer />

						<MapEditorCanvas />
					</MapEditorContextProvider>
				</KeyStateContextProvider>
			</EditorContextProvider>
		</motion.main>
	)
}
