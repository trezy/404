// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Module imports
import styles from './GamepadsSettings.module.scss'

import { Combobox } from '../../Combobox/Combobox.jsx'
import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'
import { GamepadTemplate } from './GamepadTemplate.jsx'
import { useRafael } from '../../../hooks/useRafael.js'
import { useStore } from '../../../store/react.js'





/**
 * Manage the game controls.
 *
 * @param {object} props All component props.
 * @param {object} [props.variants] An object representing variations of the component's state to be used for animations.
 * @param {object} [props.variants.animate] The typical state of the component.
 * @param {object} [props.variants.exit] The state to which the component should be animated when it is unmounted.
 * @param {object} [props.variants.initial] The state from which the component should be animated when it is mounted.
 */
export function GamepadsSettings(props) {
	const { variants } = props

	const [gameManager] = useStore(state => ([state.gameManager]))
	const { controlsManager } = gameManager

	const [gamepads, setGamepads] = useState(
		Object
			.values(controlsManager.gamepads)
			.map((gamepad, index) => {
				if (gamepad === null) {
					return gamepad
				}

				return {
					gamepad,
					label: gamepad?.name,
					value: index,
				}
			})
			.filter(gamepad => gamepad !== null),
	)

	const [selectedGamepad, setSelectedGamepad] = useState(gamepads[0])
	const [gamepadIsReady, setGamepadIsReady] = useState(selectedGamepad?.gamepad.isReady || false)

	const handleGamepadChange = useCallback(selectedOption => {
		const gamepad = gamepads[selectedOption.value]
		setSelectedGamepad(gamepad)
		setGamepadIsReady(gamepad.gamepad.isReady)
	}, [
		gamepads,
		setGamepadIsReady,
		setSelectedGamepad,
	])

	const handleGamepadReady = useCallback(() => setGamepadIsReady(true), [setGamepadIsReady])

	const updateGamepadState = useCallback(() => {
		let shouldUpdate = controlsManager.gamepadCount !== gamepads.length

		if (!shouldUpdate) {
			const filteredGamepads = Object
				.values(controlsManager.gamepads)
				.filter(gamepad => (gamepad !== null))

			shouldUpdate = gamepads.some(({ gamepad }) => {
				return !filteredGamepads.includes(gamepad)
			})
		}

		if (shouldUpdate) {
			const newGamepads = Object
				.values(controlsManager.gamepads)
				.map((gamepad, index) => {
					if (gamepad === null) {
						return gamepad
					}

					return {
						gamepad,
						label: gamepad?.name,
						value: index,
					}
				})
				.filter(gamepad => gamepad !== null)

			setGamepads(newGamepads)

			if (!selectedGamepad) {
				const gamepad = newGamepads[0]
				setSelectedGamepad(gamepad)
				setGamepadIsReady(gamepad.gamepad.isReady)
			}
		}
	}, [
		controlsManager,
		gamepads,
		selectedGamepad,
		setGamepadIsReady,
		setGamepads,
		setSelectedGamepad,
	])

	useRafael({
		task: updateGamepadState,
		dependencies: [
			gameManager,
			selectedGamepad,
			setGamepads,
		],
	})

	useRafael({
		task: controlsManager.update,
		options: {
			context: controlsManager,
		},
		dependencies: [controlsManager],
	})

	useEffect(() => {
		if (selectedGamepad) {
			selectedGamepad.gamepad.once('ready', handleGamepadReady)
			return () => selectedGamepad.gamepad.off('ready', handleGamepadReady)
		}
	}, [
		handleGamepadReady,
		selectedGamepad,
		setGamepadIsReady,
	])

	return (
		<motion.div
			animate={'animate'}
			exit={'exit'}
			className={styles['wrapper']}
			initial={'initial'}
			variants={variants}>
			<DecoratedHeader className={styles['decorated-header']}>
				{'Controls'}
			</DecoratedHeader>

			<div className={styles['mappings-wrapper']}>
				<Combobox
					emptyMessage={'No gamepads connected'}
					isDisabled={controlsManager.gamepadCount === 0}
					onChange={handleGamepadChange}
					options={gamepads}
					value={selectedGamepad} />

				<dl className={styles['mappings']}>
					<dt>{'Move Tile Up'}</dt>
					<dd>{'D-Pad Up'}</dd>

					<dt>{'Move Tile Down'}</dt>
					<dd>{'D-Pad Down'}</dd>

					<dt>{'Move Tile Left'}</dt>
					<dd>{'D-Pad Left'}</dd>

					<dt>{'Move Tile Right'}</dt>
					<dd>{'D-Pad Right'}</dd>
				</dl>
			</div>

			<div className={styles['mappings-visualiser']}>
				{!selectedGamepad && (
					'Select a gamepad'
				)}

				{(selectedGamepad && !gamepadIsReady) && (
					'Loading...'
				)}

				{(selectedGamepad && gamepadIsReady) && (
					<GamepadTemplate gamepad={selectedGamepad} />
				)}
			</div>
		</motion.div>
	)
}

GamepadsSettings.defaultProps = {
	variants: null,
}

GamepadsSettings.propTypes = {
	variants: PropTypes.object,
}
