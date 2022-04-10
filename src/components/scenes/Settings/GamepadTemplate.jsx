// Module imports
import {
	useEffect,
	useMemo,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { GamepadSpritesheet } from './GamepadSpritesheet.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders a Gamepad.
 *
 * @param {object} props All component props.
 * @param {object} [props.className] Classes to be applied to the component.
 */
export function GamepadTemplate(props) {
	const { className } = props

	const [gameManager] = useStore(state => ([
		state.gameManager,
	]))

	const compiledClassnames = useMemo(() => {
		return classnames('gamepad-template', 'ps5', className)
	}, [className])

	const controlSprites = useMemo(() => {
		const result = []

		while (result.length < 16) {
			result.push((
				<GamepadSpritesheet
					key={result.length}
					sprite={result.length} />
			))
		}

		return result
	}, [])

	useEffect(() => {
		gameManager.controlsManager.getGamepad()
	}, [gameManager])

	return (
		<div className={compiledClassnames}>
			<GamepadSpritesheet sprite={'gamepad'} />
			{controlSprites}
		</div>
	)
}

GamepadTemplate.defaultProps = {
	className: '',
}

GamepadTemplate.propTypes = {
	className: PropTypes.string,
}
