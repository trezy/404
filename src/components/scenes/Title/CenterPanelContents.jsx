// Module imports
import {
	AnimatePresence,
	LayoutGroup,
	motion,
} from 'framer-motion'
import {
	useCallback,
	useMemo,
} from 'react'





// Local imports
import styles from './CenterPanelContents.module.scss'

import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { GameTitle } from '../../GameTitle/GameTitle.jsx'
import { useStore } from '../../../store/react.js'
import { useUIStore } from '../../../store/ui.js'





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

	const [
		isCampaignMenuVisible,
		isCustomGameMenuVisible,
	] = useUIStore(state => {
		return [
			state.titleState.isCampaignMenuVisible,
			state.titleState.isCustomGameMenuVisible,
		]
	})

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
			<LayoutGroup>
				<motion.div layoutId={'game-title'}>
					<GameTitle />
				</motion.div>

				<motion.div layoutId={'game-menu'}>
					<AnimatePresence mode={'wait'}>
						{isCampaignMenuVisible && (
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
						)}

						{isCustomGameMenuVisible && (
							<ButtonStack key={'custom game menu'}>
								<Button>
									{'Pick a map!'}
								</Button>
							</ButtonStack>
						)}
					</AnimatePresence>
				</motion.div>
			</LayoutGroup>
		</motion.div>
	)
}
