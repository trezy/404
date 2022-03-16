// Module imports
import { AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'





// Local imports
import { LoadingGameScene } from './scenes/LoadingGameScene.jsx'
import { SettingsScene } from './scenes/SettingsScene.jsx'
import { TitleScene } from './scenes/TitleScene.jsx'
import { useStore } from '../store/react.js'





// Constants
const SCENES = {
	level: {},
	levelSelect: {},
	loadingGame: {
		component: <LoadingGameScene />,
	},
	settings: {
		component: <SettingsScene />
	},
	title: {
		component: <TitleScene />
	},
}





export function SceneManager() {
	const [currentScene] = useStore(state => [
		state.currentScene,
	])

	const scene = useMemo(() => SCENES[currentScene], [
		currentScene,
		SCENES,
	])

	return (
		<AnimatePresence exitBeforeEnter>
			{scene.component}
		</AnimatePresence>
	)
}
