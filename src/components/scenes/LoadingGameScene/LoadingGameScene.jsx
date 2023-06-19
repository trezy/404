// Module imports
import { useEffect, useState } from 'react'
import { useStore } from 'statery'





// Local imports
import styles from './LoadingGameScene.module.scss'

import { GameTitle } from '../../GameTitle/GameTitle.jsx'
import { initialiseFilesystem } from '../../../newStore/helpers/initialiseFilesystem.js'
import { loadGameAssets } from '../../../game/loadGameAssets.js'
import { MAIN_MENU } from '../../../constants/SceneNames.js'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { Scene } from '../../Scene/Scene.jsx'
import { setupPixiApp } from '../../../newStore/helpers/setupPixiApp.js'
import { store } from '../../../newStore/store.js'





// Constants
const VARIANTS = {
	animate: {
		opacity: 1,
	},

	exit: {
		opacity: 0,
	},

	initial: {
		opacity: 0,
	},
}





export function LoadingGameScene() {
	const {
		areAssetsLoaded,
		controlsManager,
		isFilesystemInitialised,
		pixiApp,
	} = useStore(store)

	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		if (!isFilesystemInitialised) {
			initialiseFilesystem()
		} else if (!pixiApp) {
			setupPixiApp()
		} else if (!areAssetsLoaded) {
			loadGameAssets()
		} else {
			store.state.controlsManager.start()
			setIsLoaded(true)
		}
	}, [
		areAssetsLoaded,
		isFilesystemInitialised,
		pixiApp,
		setIsLoaded,
	])

	useEffect(() => {
		if (areAssetsLoaded) {
			return
		}

	}, [areAssetsLoaded])

	useEffect(() => {
		if (isLoaded) {
			pushScene(MAIN_MENU)
		}
	}, [isLoaded])

	return (
		<Scene
			key={'loading-game'}
			animate={'animate'}
			className={styles['loading-game']}
			exit={'exit'}
			initial={'initial'}
			variants={VARIANTS}>
			<GameTitle />
			<p>{'loading...'}</p>
		</Scene>
	)
}
