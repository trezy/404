// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





/**
 * Renders a sprite from a Gamepad spritesheet.
 *
 * @param {object} props All component props.
 * @param {object} [props.className] Classes to be applied to the component.
 * @param {string} [props.gamepadType] The gamepad spritesheet to use.
 * @param {boolean} [props.isPressed] If the sprite is a button, whether or not it is currently pressed.
 * @param {number | 'gamepad'} [props.sprite] The sprite to displayed from the spritesheet.
 */
export function GamepadSpritesheet(props) {
	const {
		className,
		gamepadType,
		isPressed,
		sprite,
	} = props

	const elementProps = useMemo(() => {
		const result = {
			className: classnames(className, 'gamepad-spritesheet', {
				'gamepad': sprite === 'gamepad',
				'is-pressed': (sprite !== 'gamepad') && isPressed,
			}),
			style: {
				backgroundImage: `url('/gamepads/${gamepadType}/spritesheet.png')`,
				role: 'image',
			},
		}

		if (sprite !== 'gamepad') {
			result['data-sprite-index'] = sprite
		}

		return result
	}, [
		className,
		gamepadType,
		isPressed,
		sprite,
	])

	return (
		<div {...elementProps} />
	)
}

GamepadSpritesheet.defaultProps = {
	className: '',
	gamepadType: 'ps5',
	isPressed: false,
}

GamepadSpritesheet.propTypes = {
	className: PropTypes.string,
	gamepadType: PropTypes.string,
	isPressed: PropTypes.bool,
	sprite: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]).isRequired,
}
