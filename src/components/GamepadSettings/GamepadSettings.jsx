// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
} from 'react'
import { useStore } from 'statery'





// Module imports
import styles from './GamepadSettings.module.scss'

import { Combobox } from '../Combobox/Combobox.jsx'
import { GamepadVisualiser } from '../GamepadVisualiser/GamepadVisualiser.jsx'
import { MappingTable } from '../MappingTable/MappingTable.jsx'
import { store } from './store.js'





// Constants
const BINDINGS = {
	moveNorth: {
		gamepad: {
			primary: [
				['button', 12]
			],
			secondary: null,
		},
		keyboard: {
			primary: ['KeyW'],
			secondary: ['ArrowUp'],
		},
		label: 'Move Tile Up',
	},
	moveWest: {
		gamepad: {
			primary: [
				['button', 14]
			],
			secondary: null,
		},
		keyboard: {
			primary: ['KeyA'],
			secondary: ['ArrowLeft'],
		},
		label: 'Move Tile Left',
	},
	moveSouth: {
		gamepad: {
			primary: [
				['button', 13]
			],
			secondary: null,
		},
		keyboard: {
			primary: ['KeyS'],
			secondary: ['ArrowDown'],
		},
		label: 'Move Tile Down',
	},
	moveEast: {
		gamepad: {
			primary: [
				['button', 15]
			],
			secondary: null,
		},
		keyboard: {
			primary: ['KeyD'],
			secondary: ['ArrowRight'],
		},
		label: 'Move Tile Right',
	},
	placeTileset: {
		gamepad: {
			primary: [
				['button', 0]
			],
			secondary: null,
		},
		keyboard: {
			primary: ['Space'],
			secondary: null,
		},
		label: 'Place Tileset',
	},
	skipTimer: {
		gamepad: {
			primary: [
				['button', 2]
			],
			secondary: null,
		},
		keyboard: {
			primary: ['Enter'],
			secondary: null,
		},
		label: 'Skip Timer',
	},
}





/**
 * Manage keyboard and mouse settings.
 */
export function GamepadSettings() {
	const {
		controlsManager,
		gamepad,
		gamepads,
	} = useStore(store)

	const handleGamepadChange = useCallback(option => {
		store.set(() => ({ gamepad: option }))
	}, [])

	const updateGamepads = useCallback(() => {
		store.set(() => ({
			gamepads: Object
				.values(controlsManager.gamepads)
				.filter(Boolean),
		}))
	}, [controlsManager])

	const gamepadOptions = useMemo(() => {
		return gamepads.map(gamepadItem => ({
			label: gamepadItem.name,
			value: gamepadItem,
		}))
	}, [gamepads])

	useEffect(() => {
		updateGamepads()
		controlsManager.on('gamepad connected', updateGamepads)
		controlsManager.on('gamepad disconnected', updateGamepads)

		return () => {
			controlsManager.off('gamepad connected', updateGamepads)
			controlsManager.off('gamepad disconnected', updateGamepads)
		}
	}, [
		controlsManager,
		updateGamepads,
	])

	return (
		<div className={styles['wrapper']}>
			<div className={styles['mappings-wrapper']}>
				<MappingTable
					mappings={BINDINGS}
					mode={'gamepad'} />
			</div>

			<div className={styles['mappings-visualiser']}>
				<Combobox
					className={styles['gamepad-combobox']}
					emptyMessage={'No controllers connected'}
					isDisabled={!gamepads.length}
					onChange={handleGamepadChange}
					options={gamepadOptions}
					value={gamepad} />

				{!gamepads.length && 'No controllers connected.'}

				{Boolean(gamepads.length && !gamepad) && 'Select a controller.'}

				{Boolean(gamepads.length && gamepad) && (
					<GamepadVisualiser gamepad={gamepad.value} />
				)}
			</div>
		</div>
	)
}
