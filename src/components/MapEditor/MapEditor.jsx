// Module imports
import { motion } from 'framer-motion'
import { useMemo } from 'react'





// Local imports
import { EditorContextProvider } from '../scenes/Architect/context/EditorContext.jsx'
import { KeyStateContextProvider } from '../scenes/Architect/context/KeyStateContext.jsx'
import { MapEditorCanvas } from './MapEditorCanvas.jsx'
import { PanelContainer } from '../PanelContainer.jsx'
import { ResourcepackEditorContextProvider } from '../scenes/Architect/context/ResourcepackEditorContext.jsx'
import { ResourcepacksPanel } from './ResourcepacksPanel/ResourcepacksPanel.jsx'
import { TilePalettePanel } from './TilePalettePanel/TilePalettePanel.jsx'
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
			TilePalettePanel,
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
			<ResourcepackEditorContextProvider>
				<EditorContextProvider>
					<KeyStateContextProvider>
						<PanelContainer panels={leftPanels} />

						<MapEditorCanvas />
					</KeyStateContextProvider>
				</EditorContextProvider>
			</ResourcepackEditorContextProvider>
		</motion.main>
	)
}
