// Module imports
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useStore } from 'statery'





// Local imports
import styles from './KeyboardKey.module.scss'

import classnames from 'classnames'
import { store } from '../../newStore/store.js'





// Constants
const ADDITIONAL_KEYBOARD_LAYOUT = Object
	.entries({
		'AltLeft': '',
		'AltRight': '',
		'ControlLeft': '',
		'ControlRight': '',
		'MetaLeft': '',
		'MetaRight': '',
		'Space': '_',
	})
	.reduce((accumulator, [code, character]) => {
		accumulator.set(code, character)
		return accumulator
	}, new Map)
const CONTROL_PAD_LAYOUT_MAP = Object
	.entries({
		'Delete': '',
		'End': '',
		'Home': '',
		'Insert': '',
		'PageDown': '',
		'PageUp': '',
	})
	.reduce((accumulator, [code, character]) => {
		accumulator.set(code, character)
		return accumulator
	}, new Map)
const NUMPAD_LAYOUT_MAP = Object
	.entries({
		'Numpad0': '0',
		'Numpad1': '1',
		'Numpad2': '2',
		'Numpad3': '3',
		'Numpad4': '4',
		'Numpad5': '5',
		'Numpad6': '6',
		'Numpad7': '7',
		'Numpad8': '8',
		'Numpad9': '9',
		'NumpadAdd': '+',
		'NumpadDecimal': '.',
		'NumpadDivide': '/',
		'NumLock': '',
		'NumpadMultiply': '*',
		'NumpadSubtract': '-',
	})
	.reduce((accumulator, [code, character]) => {
		accumulator.set(code, character)
		return accumulator
	}, new Map)





export function KeyboardKey(props) {
	const {
		code,
		displayKey,
		isInline,
		isPressed,
	} = props

	const { keyboardLayoutMap } = useStore(store)

	const compiledClassName = useMemo(() => {
		return classnames(styles['key'], styles[`keycode-${code}`], {
			[styles['is-active']]: isPressed,
			[styles['is-inline']]: isInline,
		})
	}, [
		code,
		isInline,
		isPressed,
	])

	const renderedKey = useMemo(() => {
		return displayKey
			?? keyboardLayoutMap.get(code)
			?? ADDITIONAL_KEYBOARD_LAYOUT.get(code)
			?? CONTROL_PAD_LAYOUT_MAP.get(code)
			?? NUMPAD_LAYOUT_MAP.get(code)
			?? code
	}, [
		code,
		displayKey,
		keyboardLayoutMap,
	])

	return (
		<span className={compiledClassName}>
			<span className={styles['icon']} />
			<span className={styles['text']}>
				{renderedKey}
			</span>
		</span>
	)
}

KeyboardKey.defaultProps = {
	children: null,
	code: null,
	displayKey: null,
	isInline: false,
	isPressed: false,
}

KeyboardKey.propTypes = {
	children: PropTypes.node,
	code: PropTypes.string,
	displayKey: PropTypes.string,
	isInline: PropTypes.bool,
	isPressed: PropTypes.bool,
}
