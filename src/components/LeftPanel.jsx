// Module imports
import { AnimatePresence } from 'framer-motion'





// Local imports
import { Panel } from './Panel.jsx'
import { useStore } from '../store/react.js'

import { LeftPanelContents as LoadingMapSceneLeftPanelContents } from './scenes/LoadingMap/LeftPanelContents.jsx'
import { LeftPanelContents as MapSelectSceneLeftPanelContents } from './scenes/MapSelect/LeftPanelContents.jsx'
import { LeftPanelContents as PlaySceneLeftPanelContents } from './scenes/Play/LeftPanelContents.jsx'
import { LeftPanelContents as SaveSelectSceneLeftPanelContents } from './scenes/SaveSelect/LeftPanelContents.jsx'
import { LeftPanelContents as SettingsSceneLeftPanelContents } from './scenes/Settings/LeftPanelContents.jsx'
import { LeftPanelContents as TitleSceneLeftPanelContents } from './scenes/Title/LeftPanelContents.jsx'





/**
 * Renders the game's left panel.
 */
export function LeftPanel() {
	const [scene] = useStore(state => [state.scene])

	return (
		<Panel>
			<h2>{'Menu'}</h2>

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
