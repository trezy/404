// Module imports
import { useMemo } from 'react'





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
			delay: 0.1,
			damping: 30,
			type: 'spring',
			stiffness: 500,
		},
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

	const isCentered = useMemo(() => {
		return [
			'loadingMap',
			'title',
		].includes(scene)
	}, [scene])

	return (
		<Panel
			columnSpan={3}
			isCentered={isCentered}
			variants={PANEL_VARIANTS}>
			{(scene === 'loadingMap') && (
				<LoadingMapSceneCenterPanelContents />
			)}

			{(scene === 'mapSelect') && (
				<MapSelectSceneCenterPanelContents />
			)}

			{(scene === 'play') && (
				<PlaySceneCenterPanelContents />
			)}

			{(scene === 'saveSelect') && (
				<SaveSelectSceneCenterPanelContents />
			)}

			{(scene === 'settings') && (
				<SettingsSceneCenterPanelContents />
			)}

			{(scene === 'title') && (
				<TitleSceneCenterPanelContents />
			)}
		</Panel>
	)
}
