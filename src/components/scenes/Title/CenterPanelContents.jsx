// Module imports
import {
	useCallback,
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
		saveManager,
	] = useStore(state => [
    state.mostRecentSaveID,
    state.saveManager,
  ])

	const hasSaves = useMemo(() => {
		return Boolean(saveManager.getAllSaves().length)
	}, [saveManager])

	const handleContinueClick = useCallback(() => {
		pushScene(MAP_SELECT)
		// goToMapSelect(mostRecentSaveID)
	}, [mostRecentSaveID])

	return (
		<motion.div
			className={styles['game-title-wrapper']}
			layout>
			<GameTitle />

			<ButtonStack key={'campaign menu'}>
				{Boolean(mostRecentSaveID) && (
					<Button
						isAffirmative
						onClick={handleContinueClick}>
						{'Continue'}
					</Button>
				)}

				<Button onClick={handleNewGameClick}>
					{'New Game'}
				</Button>

				{hasSaves && (
					<Button onClick={handleLoadGameClick}>
						{'Load Game'}
					</Button>
				)}
			</ButtonStack>
		</motion.div>
	)
}
