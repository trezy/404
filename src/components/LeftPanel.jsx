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
	const [currentScene] = useStore(state => [state.currentScene])

	return (
		<Panel>
			<h2>{'Menu'}</h2>

			<AnimatePresence exitBeforeEnter>
				{(currentScene === 'loadingMap') && (
					<LoadingMapSceneLeftPanelContents key={'LoadingMapSceneLeftPanelContents'} />
				)}

				{(currentScene === 'mapSelect') && (
					<MapSelectSceneLeftPanelContents key={'MapSelectSceneLeftPanelContents'} />
				)}

				{(currentScene === 'play') && (
					<PlaySceneLeftPanelContents key={'PlaySceneLeftPanelContents'} />
				)}

				{(currentScene === 'saveSelect') && (
					<SaveSelectSceneLeftPanelContents key={'SaveSelectSceneLeftPanelContents'} />
				)}

				{(currentScene === 'settings') && (
					<SettingsSceneLeftPanelContents key={'SettingsSceneLeftPanelContents'} />
				)}

				{(currentScene === 'title') && (
					<TitleSceneLeftPanelContents key={'TitleSceneLeftPanelContents'} />
				)}
			</AnimatePresence>
		</Panel>
	)
}
