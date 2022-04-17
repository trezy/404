// Module imports
import {
	useMemo,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { Gamepad } from '../../../game/Gamepad.js'
import { GamepadSpritesheet } from './GamepadSpritesheet.jsx'
import { useRafael } from '../../../hooks/useRafael.js'





/**
 * Renders a Gamepad.
 *
 * @param {object} props All component props.
 * @param {string} [props.className] Classes to be applied to the component.
 * @param {object} [props.gamepad] Info about the gamepad to be emulated by this template.
 * @param {Gamepad} [props.gamepad.gamepad] The gamepad to be emulated by this template.
 * @param {string} [props.gamepad.label] The gamepad label.
 * @param {number} [props.gamepad.value] The gamepad index.
 */
export function GamepadTemplate(props) {
	const {
		className,
		gamepad,
	} = props

	const [gamepadState, setGamepadState] = useState(gamepad.gamepad.state)

	const compiledClassnames = useMemo(() => {
		return classnames('gamepad-template', 'ps5', className)
	}, [className])

	const controlSprites = useMemo(() => {
		return gamepadState.buttons.map((button, index) => {
			let xOffset = button.position.x - button.offset.x
			let yOffset = button.position.y - button.offset.y

			if (button.axes) {
				xOffset += gamepadState.axes[button.axes.x].value * 4
				yOffset += gamepadState.axes[button.axes.y].value * 4
			}

			return (
				<GamepadSpritesheet
					key={index}
					height={button.size.height}
					isPressed={Boolean(button.isPressed)}
					sourceX={button.sourcePosition.x}
					sourceY={button.sourcePosition.y}
					sprite={index}
					type={gamepad.gamepad.type}
					width={button.size.width}
					xOffset={xOffset}
					yOffset={yOffset} />
			)
		})
	}, [
		gamepad,
		gamepadState,
	])

	useRafael({
		// eslint-disable-next-line jsdoc/require-jsdoc
		task: () => setGamepadState({ ...gamepad.gamepad.state }),
		dependencies: [gamepad],
	})

	return (
		<div className={compiledClassnames}>
			<GamepadSpritesheet sprite={'gamepad'} />
			{controlSprites}
		</div>
	)
}

GamepadTemplate.defaultProps = {
	className: '',
	gamepad: null,
}

GamepadTemplate.propTypes = {
	className: PropTypes.string,
	gamepad: PropTypes.object,
}
