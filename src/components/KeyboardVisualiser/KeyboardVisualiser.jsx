// Module imports
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './KeyboardVisualiser.module.scss'

import { KeyboardKey } from './KeyboardKey.jsx'





// Constants
const KEY_CODES = [
	// Row 1
	'Backquote',
	'Digit1',
	'Digit2',
	'Digit3',
	'Digit4',
	'Digit5',
	'Digit6',
	'Digit7',
	'Digit8',
	'Digit9',
	'Digit0',
	'Minus',
	'Equal',
	'Backspace',
	'Insert',
	'Home',
	'PageUp',
	'NumLock',
	'NumpadDivide',
	'NumpadMultiply',
	'NumpadSubtract',

	// Row 2
	'Tab',
	'KeyQ',
	'KeyW',
	'KeyE',
	'KeyR',
	'KeyT',
	'KeyY',
	'KeyU',
	'KeyI',
	'KeyO',
	'KeyP',
	'BracketLeft',
	'BracketRight',
	'Backslash',
	'Delete',
	'End',
	'PageDown',
	'Numpad7',
	'Numpad8',
	'Numpad9',
	'NumpadAdd',

	// Row 3
	'CapsLock',
	'KeyA',
	'KeyS',
	'KeyD',
	'KeyF',
	'KeyG',
	'KeyH',
	'KeyJ',
	'KeyK',
	'KeyL',
	'Semicolon',
	'Quote',
	'Enter',
	null,
	null,
	null,
	'Numpad4',
	'Numpad5',
	'Numpad6',

	// Row 4
	'ShiftLeft',
	'KeyZ',
	'KeyX',
	'KeyC',
	'KeyV',
	'KeyB',
	'KeyN',
	'KeyM',
	'Comma',
	'Period',
	'Slash',
	'ShiftRight',
	null,
	'ArrowUp',
	null,
	'Numpad1',
	'Numpad2',
	'Numpad3',
	'NumpadEnter',

	// Row 5
	'ControlLeft',
	'AltLeft',
	'MetaLeft',
	'Space',
	'MetaRight',
	'AltRight',
	'ControlRight',
	'ArrowLeft',
	'ArrowDown',
	'ArrowRight',
	'Numpad0',
	'NumpadDecimal',
]





export function KeyboardVisualiser(props) {
	const { activeKeys } = props

	const mappedKeys = useMemo(() => {
		return KEY_CODES.map((code, index) => {
			if (code) {
				return (
					<KeyboardKey
						key={code}
						code={code}
						isPressed={activeKeys?.includes(code)} />
				)
			}

			return (
				<div
					key={index}
					className={styles['spacer']} />
			)
		})
	}, [activeKeys])

	return (
		<div className={styles['keyboard-visualiser']}>
			{mappedKeys}
		</div>
	)
}

KeyboardVisualiser.defaultProps = {
	activeKeys: null,
}

KeyboardVisualiser.propTypes = {
	activeKeys: PropTypes.arrayOf(PropTypes.string),
}
