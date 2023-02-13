// Module imports
import {
	Fragment,
	useCallback,
	useMemo,
	useState,
} from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Module imports
import styles from './ControlsSettings.module.scss'

import { Combobox } from '../../Combobox.jsx'
import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'
import { GamepadTemplate } from './GamepadTemplate.jsx'
import { KeyboardKey } from '../../KeyboardVisualiser/KeyboardKey.jsx'
import { KeyboardVisualiser } from '../../KeyboardVisualiser/KeyboardVisualiser.jsx'
import { Tabs } from '../../Tabs/Tabs.jsx'
import { useRafael } from '../../../hooks/useRafael.js'
import { useStore } from '../../../store/react.js'





// Constants
const BINDINGS = {
	moveNorth: {
		gamepad: {},
		keyboard: {
			primary: ['KeyW'],
			secondary: ['ArrowUp'],
		},
		label: 'Move Tile Up',
	},
	moveWest: {
		gamepad: {},
		keyboard: {
			primary: ['KeyA'],
			secondary: ['ArrowLeft'],
		},
		label: 'Move Tile Left',
	},
	moveSouth: {
		gamepad: {},
		keyboard: {
			primary: ['KeyS'],
			secondary: ['ArrowDown'],
		},
		label: 'Move Tile Down',
	},
	moveEast: {
		gamepad: {},
		keyboard: {
			primary: ['KeyD'],
			secondary: ['ArrowRight'],
		},
		label: 'Move Tile Right',
	},
}
const TABS = [
	{
		id: 'keyboard',
		label: 'Keyboard & Mouse',
	},
	{
		id: 'controller',
		label: 'Controller',
	},
]





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

	const [activeKeys, setActiveKeys] = useState(null)
	const [activeTabID, setActiveTabID] = useState('keyboard')

	const handleTabFocus = useCallback(tabID => setActiveTabID(tabID), [setActiveTabID])

	const mappedBindings = useMemo(() => {
		return Object
			.entries(BINDINGS)
			.map(([bingingID, binding]) => {
				const handlePrimaryMouseOver = () => {
					setActiveKeys(binding.keyboard.primary)
				}

				const handlePrimaryMouseOut = () => {
					setActiveKeys(null)
				}

				const handleSecondaryMouseOver = () => {
					setActiveKeys(binding.keyboard.secondary)
				}

				const handleSecondaryMouseOut = () => {
					setActiveKeys(null)
				}

				return (
					<Fragment key={bingingID}>
						<dt
							onMouseOut={handlePrimaryMouseOut}
							onMouseOver={handlePrimaryMouseOver}>
							{binding.label}
						</dt>
						<dd
							onMouseOut={handlePrimaryMouseOut}
							onMouseOver={handlePrimaryMouseOver}>
							{binding.keyboard.primary.map(code => {
								return (
									<KeyboardKey
										key={code}
										code={code}
										isPressed={activeKeys === binding.keyboard.primary} />
								)
							})}
						</dd>
						<dd
							onMouseOut={handleSecondaryMouseOut}
							onMouseOver={handleSecondaryMouseOver}>
							{binding.keyboard.secondary.map(code => {
								return (
									<KeyboardKey
										key={code}
										code={code}
										isPressed={activeKeys === binding.keyboard.secondary} />
								)
							})}
						</dd>
					</Fragment>
				)
			})
	}, [
		activeKeys,
		setActiveKeys,
	])

	useRafael({
		task: controlsManager.update,
		options: {
			context: controlsManager,
		},
		dependencies: [controlsManager],
	})

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

			<Tabs
				activeTabID={activeTabID}
				onFocus={handleTabFocus}
				tabs={TABS} />

			{(activeTabID === 'keyboard') && (
				<>
					<div className={styles['mappings-wrapper']}>
						<dl className={styles['mappings']}>
							<dt>{'Control'}</dt>
							<dd>{'Primary'}</dd>
							<dd>{'Secondary'}</dd>

							{mappedBindings}
						</dl>
					</div>

					<div className={styles['mappings-visualiser']}>
						<KeyboardVisualiser activeKeys={activeKeys} />
					</div>
				</>
			)}

			{(activeTabID === 'controller') && (
				<>
					<div className={styles['mappings-wrapper']}>
						{/* <Combobox
							emptyMessage={'No gamepads connected'}
							isDisabled={controlsManager.gamepadCount === 0}
							onChange={handleGamepadChange}
							options={gamepads}
							value={selectedGamepad} /> */}

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
						{/* {!selectedGamepad && (
							'Select a gamepad'
						)}

						{(selectedGamepad && !gamepadIsReady) && (
							'Loading...'
						)}

						{(selectedGamepad && gamepadIsReady) && (
							<GamepadTemplate gamepad={selectedGamepad} />
						)} */}
					</div>
				</>
			)}
		</motion.div>
	)
}

ControlsSettings.defaultProps = {
	variants: null,
}

ControlsSettings.propTypes = {
	variants: PropTypes.object,
}
