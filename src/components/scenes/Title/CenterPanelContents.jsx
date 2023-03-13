// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import { motion } from 'framer-motion'





// Local imports
import styles from './CenterPanelContents.module.scss'

import {
	MAP_SELECT,
	SAVE_SELECT,
} from '../../../constants/SceneNames.js'
import {
	useNavGraph,
	useNavGraphContext,
} from '../../NavGraph/NavGraphContextProvider.jsx'
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

	const {
		currentTargetNodeID,
		setTargetNodeID,
	} = useNavGraphContext()

	const continueRef = useRef(null)
	const newGameRef = useRef(null)
	const loadGameRef = useRef(null)

	const hasSaves = useMemo(() => {
		return Boolean(saveManager.getAllSaves().length)
	}, [saveManager])

	const handleContinueClick = useCallback(() => {
		pushScene(MAP_SELECT)
		// goToMapSelect(mostRecentSaveID)
	}, [mostRecentSaveID])

	useNavGraph({
		id: 'center panel',
		links: ['left panel'],
		nodes: [
			{
				id: 'continue',
				isDefault: true,
				onActivate: () => console.log('Activating continue button!'),
				targetRef: continueRef,
			},
			{
				id: 'new game',
				onActivate: () => {},
				targetRef: newGameRef,
			},
			{
				id: 'load game',
				onActivate: () => {},
				targetRef: loadGameRef
			},
		],
	})

	useEffect(() => {
		setTargetNodeID('continue')
	}, [setTargetNodeID])

	return (
		<motion.div
			className={styles['game-title-wrapper']}
			layout>
			<GameTitle />

			<ButtonStack key={'campaign menu'}>
				{Boolean(mostRecentSaveID) && (
					<Button
						isAffirmative
						isGamepadFocused={currentTargetNodeID === 'continue'}
						onClick={handleContinueClick}
						ref={continueRef}>
						{'Continue'}
					</Button>
				)}

				<Button
					isGamepadFocused={currentTargetNodeID === 'new game'}
					onClick={handleNewGameClick}
					ref={newGameRef}>
					{'New Game'}
				</Button>

				{hasSaves && (
					<Button
						isGamepadFocused={currentTargetNodeID === 'load game'}
						onClick={handleLoadGameClick}
						ref={loadGameRef}>
						{'Load Game'}
					</Button>
				)}
			</ButtonStack>
		</motion.div>
	)
}
