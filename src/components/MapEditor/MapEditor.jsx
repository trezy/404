// Module imports
import { motion } from 'framer-motion'
import { useMemo } from 'react'





// Local imports
import { AssetsContextProvider } from '../scenes/Architect/context/AssetsContext.jsx'
import { EditorContainer } from '../scenes/Architect/EditorContainer.jsx'
import { EditorContextProvider } from '../scenes/Architect/context/EditorContext.jsx'
import { KeyStateContextProvider } from '../scenes/Architect/context/KeyStateContext.jsx'
import { PanelContainer } from '../PanelContainer.jsx'
import { ResourcepacksPanel } from './ResourcepacksPanel/ResourcepacksPanel.jsx'
import { TileQueuePanel } from './TileQueuePanel/TileQueuePanel.jsx'





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
	const leftPanels = useMemo(() => {
		return [
			ResourcepacksPanel,
			TileQueuePanel,
		]
	}, [])

	return (
		<motion.main
			animate={'animate'}
			className={'map-editor'}
			exit={'exit'}
			initial={'initial'}
			variants={VARIANTS}>
			<AssetsContextProvider>
				<EditorContextProvider>
					<KeyStateContextProvider>
						<PanelContainer panels={leftPanels} />

						<EditorContainer />
					</KeyStateContextProvider>
				</EditorContextProvider>
			</AssetsContextProvider>
		</motion.main>
	)
}
