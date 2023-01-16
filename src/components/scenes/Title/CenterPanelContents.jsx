// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import { motion } from 'framer-motion'





// Local imports
import styles from './CenterPanelContents.module.scss'

import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { GameTitle } from '../../GameTitle/GameTitle.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Title scene.
 */
export function CenterPanelContents() {
  const [
		goToSaveSelect,
		goToMapSelect,
		mostRecentSaveID,
		saveManager,
	] = useStore(state => [
		state.goToSaveSelect,
    state.goToMapSelect,
    state.mostRecentSaveID,
    state.saveManager,
  ])

	const hasSaves = useMemo(() => {
		return Boolean(saveManager.getAllSaves().length)
	}, [saveManager])

	const handleContinueClick = useCallback(() => {
		goToMapSelect(mostRecentSaveID)
	}, [
		goToMapSelect,
		mostRecentSaveID,
	])

	const handleLoadGameClick = useCallback(() => {
		goToSaveSelect()
	}, [goToSaveSelect])

	const handleNewGameClick = useCallback(() => {
		goToMapSelect()
	}, [goToMapSelect])

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
