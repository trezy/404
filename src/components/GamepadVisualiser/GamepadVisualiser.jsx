// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { GamepadTemplate } from '../scenes/Settings/GamepadTemplate.jsx'





export function GamepadVisualiser(props) {
	const { gamepad } = props

	const [gamepadIsReady, setGamepadIsReady] = useState(gamepad.isReady)

	const handleGamepadIsReady = useCallback(() => setGamepadIsReady(true), [setGamepadIsReady])

	useEffect(() => {
		if (!gamepadIsReady) {
			gamepad.on('ready', handleGamepadIsReady)

			return () => gamepad.off('ready', handleGamepadIsReady)
		}
	}, [
		gamepadIsReady,
		handleGamepadIsReady,
	])

	if (gamepadIsReady) {
		return (
			<GamepadTemplate gamepad={gamepad} />
		)
	}

	return (
		'Loading controller...'
	)
}

GamepadVisualiser.propTypes = {
	gamepad: PropTypes.object,
}
