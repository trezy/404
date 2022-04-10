// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Module imports
import { Combobox } from '../../Combobox.jsx'
import { GamepadTemplate } from './GamepadTemplate.jsx'
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
export function ControlsSettings(props) {
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

	const updateGamepads = useCallback(() => {
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
			setSelectedGamepad(newGamepads[0])
		}
	}, [
		controlsManager,
		selectedGamepad,
		setGamepads,
		setSelectedGamepad,
	])

	const handleGamepadChange = useCallback(selectedOption => {
		setSelectedGamepad(gamepads[selectedOption.value])
	}, [
		gamepads,
		setSelectedGamepad,
	])

	useEffect(() => {
		let shouldContinue = true

		/* eslint-disable-next-line jsdoc/require-jsdoc */
		const loop = () => {
			if (!shouldContinue) {
				return
			}

			if (controlsManager.gamepadCount !== gamepads.length) {
				updateGamepads()
			} else {
				const filteredGamepads = Object
					.values(controlsManager.gamepads)
					.filter(gamepad => (gamepad !== null))

				const haveGamepadsChanged = gamepads.some(({ gamepad }) => {
					return !filteredGamepads.includes(gamepad)
				})

				if (haveGamepadsChanged) {
					updateGamepads()
				}
			}

			requestAnimationFrame(loop)
		}

		loop()

		return () => {
			shouldContinue = false
		}
	}, [
		controlsManager,
		gameManager,
		gamepads,
		selectedGamepad,
		setGamepads,
		updateGamepads,
	])

	return (
		<motion.div
			animate={'animate'}
			exit={'exit'}
			id={'controls-settings'}
			initial={'initial'}
			variants={variants}>
			<h2>{'Controls'}</h2>

			<div className={'mappings-wrapper'}>
				<Combobox
					emptyMessage={'No gamepads connected'}
					isDisabled={controlsManager.gamepadCount === 0}
					onChange={handleGamepadChange}
					options={gamepads}
					value={selectedGamepad} />

				<dl className={'mappings'}>
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


			<div className={'mappings-visualiser'}>
				<GamepadTemplate />
			</div>
		</motion.div>
	)
}

ControlsSettings.defaultProps = {
	variants: null,
}

ControlsSettings.propTypes = {
	variants: PropTypes.object,
}
