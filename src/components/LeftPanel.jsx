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

			{(currentScene === 'loadingMap') && (
				<LoadingMapSceneLeftPanelContents />
			)}

			{(currentScene === 'mapSelect') && (
				<MapSelectSceneLeftPanelContents />
			)}

			{(currentScene === 'play') && (
				<PlaySceneLeftPanelContents />
			)}

			{(currentScene === 'saveSelect') && (
				<SaveSelectSceneLeftPanelContents />
			)}

			{(currentScene === 'settings') && (
				<SettingsSceneLeftPanelContents />
			)}

			{(currentScene === 'title') && (
				<TitleSceneLeftPanelContents />
			)}
		</Panel>
	)
}
