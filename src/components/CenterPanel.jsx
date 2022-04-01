// Module imports
import { AnimatePresence } from 'framer-motion'





// Local imports
import { Panel } from './Panel.jsx'
import { useStore } from '../store/react.js'

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
			type: 'spring',
			stiffness: 500,
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
		<AnimatePresence exitBeforeEnter>
			{(scene === 'loadingMap') && (
				<Panel
					key={'LoadingMapSceneCenterPanelContents'}
					columnSpan={3}
					isCentered
					variants={PANEL_VARIANTS}>
					<LoadingMapSceneCenterPanelContents />
				</Panel>
			)}

			{(scene === 'mapSelect') && (
				<Panel
					key={'MapSelectSceneCenterPanelContents'}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<MapSelectSceneCenterPanelContents />
				</Panel>
			)}

			{(scene === 'play') && (
				<Panel
					key={'PlaySceneCenterPanelContents'}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<PlaySceneCenterPanelContents />
				</Panel>
			)}

			{(scene === 'saveSelect') && (
				<Panel
					key={'SaveSelectSceneCenterPanelContents'}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<SaveSelectSceneCenterPanelContents />
				</Panel>
			)}

			{(scene === 'settings') && (
				<Panel
					key={'SettingsSceneCenterPanelContents'}
					columnSpan={3}
					variants={PANEL_VARIANTS}>
					<SettingsSceneCenterPanelContents />
				</Panel>
			)}

			{(scene === 'title') && (
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
