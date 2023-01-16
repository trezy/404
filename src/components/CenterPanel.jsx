// Module imports
import { AnimatePresence } from 'framer-motion'





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
import { Panel } from './Panel/Panel.jsx'
import { useStore } from '../store/react.js'

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
	const [scene] = useStore(state => [state.scene])

	return (
		<AnimatePresence mode={'wait'}>
			{(scene === CUSTOM_GAME) && (
				<Panel
					key={'CustomGameSceneCenterPanelContents'}
					columnSpan={3}
					isCentered
					variants={PANEL_VARIANTS}>
					<CustomGameSceneCenterPanelContents />
				</Panel>
			)}

			{(scene === LOADING_MAP) && (
				<Panel
					key={'LoadingMapSceneCenterPanelContents'}
					columnSpan={3}
					isCentered
					variants={PANEL_VARIANTS}>
					<LoadingMapSceneCenterPanelContents />
				</Panel>
			)}

			{(scene === MAP_SELECT) && (
				<Panel
					key={'MapSelectSceneCenterPanelContents'}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<MapSelectSceneCenterPanelContents />
				</Panel>
			)}

			{(scene === PLAY) && (
				<Panel
					key={'PlaySceneCenterPanelContents'}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<PlaySceneCenterPanelContents />
				</Panel>
			)}

			{(scene === SAVE_SELECT) && (
				<Panel
					key={'SaveSelectSceneCenterPanelContents'}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<SaveSelectSceneCenterPanelContents />
				</Panel>
			)}

			{(scene === SETTINGS) && (
				<Panel
					key={'SettingsSceneCenterPanelContents'}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<SettingsSceneCenterPanelContents />
				</Panel>
			)}

			{(scene === MAIN_MENU) && (
				<Panel
					key={'TitleSceneCenterPanelContents'}
					columnSpan={3}
					isCentered
					variants={PANEL_VARIANTS}>
					<TitleSceneCenterPanelContents />
				</Panel>
			)}
		</AnimatePresence>
	)
}
