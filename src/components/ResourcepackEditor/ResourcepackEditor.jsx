// Module imports
import { motion } from 'framer-motion'
import { useMemo } from 'react'





// Local imports
import { AssetsPanel } from './AssetsPanel.jsx'
import { EditorContainer } from '../scenes/Architect/EditorContainer.jsx'
import { EditorContextProvider } from '../scenes/Architect/context/EditorContext.jsx'
import { ExportPanel } from './ExportPanel.jsx'
import { KeyStateContextProvider } from '../scenes/Architect/context/KeyStateContext.jsx'
import { PanelContainer } from '../PanelContainer.jsx'
import { ResourcepackEditorContextProvider } from '../scenes/Architect/context/ResourcepackEditorContext.jsx'
import { TilesPanel } from './TilesPanel.jsx'





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
	const leftPanels = useMemo(() => {
		return [
			AssetsPanel,
			TilesPanel,
			ExportPanel,
		]
	}, [])

	return (
		<motion.main
			animate={'animate'}
			className={'asset-pack-creator map-editor'}
			exit={'exit'}
			initial={'initial'}
			variants={VARIANTS}>
			<ResourcepackEditorContextProvider>
				<EditorContextProvider>
					<KeyStateContextProvider>
						<PanelContainer panels={leftPanels} />

						<EditorContainer />
					</KeyStateContextProvider>
				</EditorContextProvider>
			</ResourcepackEditorContextProvider>
		</motion.main>
	)
}
