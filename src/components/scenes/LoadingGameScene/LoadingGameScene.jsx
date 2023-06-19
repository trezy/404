// Module imports
import {
	useEffect,
	useState,
} from 'react'
import {
	AnimatePresence,
	motion,
} from 'framer-motion'
import { useStore } from 'statery'





// Local imports
import styles from './LoadingGameScene.module.scss'

import { GameTitle } from '../../GameTitle/GameTitle.jsx'
import { loadGame } from '../../../newStore/helpers/loadGame.js'
import { MAIN_MENU } from '../../../constants/SceneNames.js'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { Scene } from '../../Scene/Scene.jsx'
import { store } from '../../../newStore/store.js'





// Constants
const MESSAGE_VARIANTS = {
	animate: {
		opacity: 1,
		y: 0,
	},

	exit: {
		opacity: 0,
		y: '150%',
	},

	initial: {
		opacity: 0,
		y: '-150%',
	},
}
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
		assetLoadingProgress,
		isInitialisingFilesystem,
		isLoadingAssets,
		isSettingUpPixi,
	} = useStore(store)

	const [isLoading, setIsLoading] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		if (!isLoading) {
			setIsLoading(true)
			loadGame().then(() => {
				setIsLoaded(true)
			})
		}
	}, [
		isLoading,
		setIsLoaded,
		setIsLoading,
	])

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
			<div className={styles['message-wrapper']}>
				<AnimatePresence>
					{isInitialisingFilesystem && (
						<motion.p
							key={'filesystemSetup'}
							animate={'animate'}
							exit={'exit'}
							initial={'initial'}
							variants={MESSAGE_VARIANTS}>
							{'Setting up the filesystem'}
						</motion.p>
					)}

					{isSettingUpPixi && (
						<motion.p
							key={'rendererSetup'}
							animate={'animate'}
							exit={'exit'}
							initial={'initial'}
							variants={MESSAGE_VARIANTS}>
							{'Setting up the renderer'}
						</motion.p>
					)}

					{isLoadingAssets && (
						<motion.p
							key={'assetLoading'}
							animate={'animate'}
							exit={'exit'}
							initial={'initial'}
							variants={MESSAGE_VARIANTS}>
							{`Loading assets (${Math.floor(assetLoadingProgress) * 100}%)`}
						</motion.p>
					)}
				</AnimatePresence>
			</div>
		</Scene>
	)
}
