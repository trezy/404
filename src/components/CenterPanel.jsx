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
import { getCurrentScene } from '../newStore/selectors/getCurrentScene.js'
import { Panel } from './Panel/Panel.jsx'
import { store } from '../newStore/store.js'

import { CenterPanelContents as CustomGameSceneCenterPanelContents } from './scenes/CustomGame/CenterPanelContents.jsx'
import { CenterPanelContents as LoadingMapSceneCenterPanelContents } from './scenes/LoadingMap/CenterPanelContents.jsx'
import { CenterPanelContents as MapSelectSceneCenterPanelContents } from './scenes/MapSelect/CenterPanelContents.jsx'
import { CenterPanelContents as PlaySceneCenterPanelContents } from './scenes/Play/CenterPanelContents.jsx'
import { CenterPanelContents as SaveSelectSceneCenterPanelContents } from './scenes/SaveSelect/CenterPanelContents.jsx'
import { CenterPanelContents as SettingsSceneCenterPanelContents } from './scenes/Settings/CenterPanelContents.jsx'
import { CenterPanelContents as TitleSceneCenterPanelContents } from './scenes/Title/CenterPanelContents.jsx'





// Constants
const PANEL_VARIANTS = {
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			damping: 30,
			stiffness: 500,
			type: 'spring',
		},
	},

	exit: {
		opacity: 0,
		y: '100%',
	},

	initial: {
		opacity: 0,
		y: '-100%',
	},
}





/**
 * Renders the game's center panel.
 */
export function CenterPanel() {
	const proxyStore = useStore(store)
	const currentScene = getCurrentScene(proxyStore)

	return (
		<AnimatePresence mode={'wait'}>
			{(currentScene === CUSTOM_GAME) && (
				<Panel
					key={`${CUSTOM_GAME}SceneCenterPanelContents`}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<CustomGameSceneCenterPanelContents />
				</Panel>
			)}

			{(currentScene === LOADING_MAP) && (
				<Panel
					key={`${LOADING_MAP}SceneCenterPanelContents`}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<LoadingMapSceneCenterPanelContents />
				</Panel>
			)}

			{(currentScene === MAP_SELECT) && (
				<Panel
					key={`${MAP_SELECT}SceneCenterPanelContents`}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<MapSelectSceneCenterPanelContents />
				</Panel>
			)}

			{(currentScene === PLAY) && (
				<Panel
					key={`${PLAY}SceneCenterPanelContents`}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<PlaySceneCenterPanelContents />
				</Panel>
			)}

			{(currentScene === SAVE_SELECT) && (
				<Panel
					key={`${SAVE_SELECT}SceneCenterPanelContents`}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<SaveSelectSceneCenterPanelContents />
				</Panel>
			)}

			{(currentScene === SETTINGS) && (
				<Panel
					key={`${SETTINGS}SceneCenterPanelContents`}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<SettingsSceneCenterPanelContents />
				</Panel>
			)}

			{(currentScene === MAIN_MENU) && (
				<Panel
					key={`${MAIN_MENU}SceneCenterPanelContents`}
					columnSpan={3}
					isCentered
					variants={PANEL_VARIANTS}>
					<TitleSceneCenterPanelContents />
				</Panel>
			)}
		</AnimatePresence>
	)
}
