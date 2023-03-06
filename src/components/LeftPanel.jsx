// Module imports
import { AnimatePresence } from 'framer-motion'
import { useStore } from 'statery'





// Local imports
import {
	CUSTOM_GAME,
	LOADING_MAP,
	MAIN_MENU,
	MAP_SELECT,
	PLAY,
	SAVE_SELECT,
	SETTINGS,
} from '../constants/SceneNames.js'
import { DecoratedHeader } from './DecoratedHeader/DecoratedHeader.jsx'
import { getCurrentScene } from '../newStore/selectors/getCurrentScene.js'
import { Panel } from './Panel/Panel.jsx'
import { store } from '../newStore/store.js'

import { LeftPanelContents as CustomGameSceneLeftPanelContents } from './scenes/CustomGame/LeftPanelContents.jsx'
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
	const proxyStore = useStore(store)
	const currentScene = getCurrentScene(proxyStore)

	return (
		<Panel variants={PANEL_VARIANTS}>
			<DecoratedHeader>{'Menu'}</DecoratedHeader>

			<AnimatePresence mode={'wait'}>
				{(currentScene === CUSTOM_GAME) && (
					<CustomGameSceneLeftPanelContents key={'CustomGameSceneLeftPanelContents'} />
				)}

				{(currentScene === LOADING_MAP) && (
					<LoadingMapSceneLeftPanelContents key={'LoadingMapSceneLeftPanelContents'} />
				)}

				{(currentScene === MAP_SELECT) && (
					<MapSelectSceneLeftPanelContents key={'MapSelectSceneLeftPanelContents'} />
				)}

				{(currentScene === PLAY) && (
					<PlaySceneLeftPanelContents key={'PlaySceneLeftPanelContents'} />
				)}

				{(currentScene === SAVE_SELECT) && (
					<SaveSelectSceneLeftPanelContents key={'SaveSelectSceneLeftPanelContents'} />
				)}

				{(currentScene === SETTINGS) && (
					<SettingsSceneLeftPanelContents key={'SettingsSceneLeftPanelContents'} />
				)}

				{(currentScene === MAIN_MENU) && (
					<TitleSceneLeftPanelContents key={'TitleSceneLeftPanelContents'} />
				)}
			</AnimatePresence>
		</Panel>
	)
}
