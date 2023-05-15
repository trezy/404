// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { ipcRenderer } from 'electron'
import { useStore } from 'statery'





// Local imports
import styles from './LoadingGameScene.module.scss'

import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { GameTitle } from '../../GameTitle/GameTitle.jsx'
import { loadGameAssets } from '../../../game/loadGameAssets.js'
import { MAIN_MENU } from '../../../constants/SceneNames.js'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { Scene } from '../../Scene/Scene.jsx'
import { store } from '../../../newStore/store.js'





// Constants
const MINIMUM_DURATION = 2000
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
		contentManager,
	} = useStore(store)

	const [areDirectoriesInitialised, setAreDirectoriesInitialised] = useState(false)

	const initialiseFilesystem = useCallback(() => {
		return ipcRenderer.invoke('initialiseDirectories')
	}, [])

	useEffect(() => {
		if (areDirectoriesInitialised) {
			return
		}

		executePromiseWithMinimumDuration(initialiseFilesystem, MINIMUM_DURATION)
			.then(() => setAreDirectoriesInitialised(true))
	}, [
		areDirectoriesInitialised,
		initialiseFilesystem,
		setAreDirectoriesInitialised,
	])

	useEffect(() => {
		if (areAssetsLoaded) {
			return
		}

		loadGameAssets()
	}, [areAssetsLoaded])

	useEffect(() => {
		if (areAssetsLoaded && areDirectoriesInitialised) {
			pushScene(MAIN_MENU)
		}
	}, [
		areAssetsLoaded,
		areDirectoriesInitialised,
	])

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
