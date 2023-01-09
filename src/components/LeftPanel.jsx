// Module imports
import { AnimatePresence } from 'framer-motion'





// Local imports
import { Panel } from './Panel/Panel.jsx'
import { useStore } from '../store/react.js'

import { LeftPanelContents as LoadingMapSceneLeftPanelContents } from './scenes/LoadingMap/LeftPanelContents.jsx'
import { LeftPanelContents as MapSelectSceneLeftPanelContents } from './scenes/MapSelect/LeftPanelContents.jsx'
import { LeftPanelContents as PlaySceneLeftPanelContents } from './scenes/Play/LeftPanelContents.jsx'
import { LeftPanelContents as SaveSelectSceneLeftPanelContents } from './scenes/SaveSelect/LeftPanelContents.jsx'
import { LeftPanelContents as SettingsSceneLeftPanelContents } from './scenes/Settings/LeftPanelContents.jsx'
import { LeftPanelContents as TitleSceneLeftPanelContents } from './scenes/Title/LeftPanelContents.jsx'





// Constants
const PANEL_VARIANTS = {
	animate: {
		opacity: 1,
		x: 0,
		transition: {
			damping: 30,
			stiffness: 500,
			type: 'spring',
		},
	},

	initial: {
		opacity: 0,
		x: '-100%',
	},
}





/**
 * Renders the game's left panel.
 */
export function LeftPanel() {
	const [scene] = useStore(state => [state.scene])

	return (
		<Panel variants={PANEL_VARIANTS}>
			<header className={'decorated-header'}>
				<h2>{'Menu'}</h2>
			</header>

			<AnimatePresence exitBeforeEnter>
				{(scene === 'loadingMap') && (
					<LoadingMapSceneLeftPanelContents key={'LoadingMapSceneLeftPanelContents'} />
				)}

				{(scene === 'mapSelect') && (
					<MapSelectSceneLeftPanelContents key={'MapSelectSceneLeftPanelContents'} />
				)}

				{(scene === 'play') && (
					<PlaySceneLeftPanelContents key={'PlaySceneLeftPanelContents'} />
				)}

				{(scene === 'saveSelect') && (
					<SaveSelectSceneLeftPanelContents key={'SaveSelectSceneLeftPanelContents'} />
				)}

				{(scene === 'settings') && (
					<SettingsSceneLeftPanelContents key={'SettingsSceneLeftPanelContents'} />
				)}

				{(scene === 'title') && (
					<TitleSceneLeftPanelContents key={'TitleSceneLeftPanelContents'} />
				)}
			</AnimatePresence>
		</Panel>
	)
}
