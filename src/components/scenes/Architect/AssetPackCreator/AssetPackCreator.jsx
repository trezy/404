// Module imports
import { motion } from 'framer-motion'
import { useMemo } from 'react'





// Local imports
import { AssetsContextProvider } from '../context/AssetsContext.jsx'
import { AssetsPanel } from './AssetsPanel.jsx'
import { EditorContainer } from '../EditorContainer.jsx'
import { EditorContextProvider } from '../context/EditorContext.jsx'
import { ExportPanel } from './ExportPanel.jsx'
import { KeyStateContextProvider } from '../context/KeyStateContext.jsx'
import { PanelContainer } from '../../../PanelContainer.jsx'
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
export function AssetPackCreator() {
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
