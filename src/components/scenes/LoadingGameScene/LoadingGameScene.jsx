// Local imports
import styles from './LoadingGameScene.module.scss'

import { GameTitle } from '../../GameTitle/GameTitle.jsx'
import { Scene } from '../../Scene/Scene.jsx'





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
