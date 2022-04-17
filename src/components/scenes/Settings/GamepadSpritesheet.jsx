// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





/**
 * Renders a sprite from a Gamepad spritesheet.
 *
 * @param {object} props All component props.
 * @param {object} [props.className] Classes to be applied to the component.
 * @param {number} [props.height] The height of the sprite.
 * @param {boolean} [props.isPressed] If the sprite is a button, whether or not it is currently pressed.
 * @param {*} [props.source] The gamepad spritesheet to use.
 * @param {number} [props.sourceX] The X position of the sprite in the spritesheet.
 * @param {number} [props.sourceY] The Y position of the sprite in the spritesheet.
 * @param {number | 'gamepad'} [props.sprite] The sprite to displayed from the spritesheet.
 * @param {number} [props.xOffset] A number of pixels by which the sprite should be offset on the X axis.
 * @param {number} [props.yOffset] A number of pixels by which the sprite should be offset on the Y axis.
 * @param {number} [props.width] The width of the sprite.
 */
export function GamepadSpritesheet(props) {
	const {
		className,
		height,
		isPressed,
		source,
		sourceX,
		sourceY,
		sprite,
		xOffset,
		yOffset,
		width,
	} = props

	const elementProps = useMemo(() => {
		const result = {
			className: classnames(className, 'gamepad-spritesheet', {
				'gamepad': sprite === 'gamepad',
				'is-pressed': (sprite !== 'gamepad') && isPressed,
			}),
			role: 'image',
			style: {
				backgroundImage: `url(${source.src})`,
				'--sprite-height': `${height}px`,
				'--sprite-source-x': `${sourceX}px`,
				'--sprite-source-y': `${sourceY}px`,
				'--sprite-template-height': `${source.height}px`,
				'--sprite-template-width': `${source.width}px`,
				'--sprite-width': `${width}px`,
				'--sprite-x-offset': `${xOffset}px`,
				'--sprite-y-offset': `${yOffset}px`,
			},
		}

		if (sprite !== 'gamepad') {
			result['data-sprite-index'] = sprite
		}

		return result
	}, [
		className,
		height,
		isPressed,
		sourceX,
		sourceY,
		sprite,
		source,
		xOffset,
		yOffset,
		width,
	])

	return (
		<div {...elementProps} />
	)
}

GamepadSpritesheet.defaultProps = {
	className: '',
	height: 0,
	isPressed: false,
	sourceX: 0,
	sourceY: 0,
	width: 0,
	xOffset: 0,
	yOffset: 0,
}

GamepadSpritesheet.propTypes = {
	className: PropTypes.string,
	height: PropTypes.number,
	isPressed: PropTypes.bool,
	source: PropTypes.any.isRequired,
	sourceX: PropTypes.number,
	sourceY: PropTypes.number,
	sprite: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]).isRequired,
	width: PropTypes.number,
	xOffset: PropTypes.number,
	yOffset: PropTypes.number,
}
