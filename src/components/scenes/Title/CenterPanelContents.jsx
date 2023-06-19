// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
} from 'react'
import { motion } from 'framer-motion'





// Local imports
import styles from './CenterPanelContents.module.scss'

import {
	MAP_SELECT,
	SAVE_SELECT,
} from '../../../constants/SceneNames.js'
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { GameTitle } from '../../GameTitle/GameTitle.jsx'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { useNavGraphContext } from '../../NavGraph/NavGraphContextProvider.jsx'
import { useStore } from '../../../store/react.js'





function handleLoadGameClick() {
	pushScene(SAVE_SELECT)
}

function handleNewGameClick() {
	pushScene(MAP_SELECT)
}

/**
 * Renders the contents of the center panel for the Title scene.
 */
export function CenterPanelContents() {
  const [
		mostRecentSaveID,
		// saveManager,
	] = useStore(state => [
    state.mostRecentSaveID,
    // state.saveManager,
  ])

	const { focusNode } = useNavGraphContext()

	// const hasSaves = useMemo(() => {
	// 	// return Boolean(saveManager.getAllSaves().length)
	// }, [saveManager])

	const handleContinueClick = useCallback(() => {
		pushScene(MAP_SELECT)
		// goToMapSelect(mostRecentSaveID)
	}, [mostRecentSaveID])

	useEffect(() => {
		focusNode('continue')
	}, [focusNode])

	return (
		<motion.div
			className={styles['game-title-wrapper']}
			layout>
			<GameTitle />

			<ButtonStack key={'campaign menu'}>
				{Boolean(mostRecentSaveID) && (
					<Button
						isAffirmative
						isNavGroupDefault
						navGroupID={'center panel'}
						navGroupLinks={['left panel']}
						nodeID={'continue'}
						onActivate={handleContinueClick}
						onClick={handleContinueClick}>
						{'Continue'}
					</Button>
				)}

				<Button
					navGroupID={'center panel'}
					navGroupLinks={['left panel']}
					nodeID={'new game'}
					onActivate={handleNewGameClick}
					onClick={handleNewGameClick}>
					{'New Game'}
				</Button>

				{/* {hasSaves && (
					<Button
						navGroupID={'center panel'}
						navGroupLinks={['left panel']}
						nodeID={'load game'}
						onActivate={handleLoadGameClick}
						onClick={handleLoadGameClick}>
						{'Load Game'}
					</Button>
				)} */}
			</ButtonStack>
		</motion.div>
	)
}
