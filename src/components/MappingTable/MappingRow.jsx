// Mapping// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useStore } from 'statery'





// Module imports
import styles from './MappingRow.module.scss'

import { GamepadSpritesheet } from '../scenes/Settings/GamepadSpritesheet.jsx'
import { KeyboardKey } from '../KeyboardKey/KeyboardKey.jsx'
import { KeyboardMapping } from '../KeyboardMapping/KeyboardMapping.jsx'
import { store } from '../KeyboardAndMouseSettings/store.js'





/**
 * Manage keyboard and mouse settings.
 */
export function MappingRow(props) {
	const {
		control,
		mapping,
		mode,
		onMappingClick,
	} = props

	const {
		activeKeys,
		gamepad,
	} = useStore(store)

	const handleMappingClick = useCallback(primaryOrSecondary => {
		onMappingClick({
			control,
			mode,
			primaryOrSecondary,
		})
	}, [
		mapping,
		mode,
		onMappingClick,
	])

	const handlePrimaryMappingClick = useCallback(() => handleMappingClick('primary'), [handleMappingClick])

	const handleSecondaryMappingClick = useCallback(() => handleMappingClick('secondary'), [handleMappingClick])

	const handlePrimaryMouseOver = useCallback(() => {
		store.set(() => ({ activeKeys: mapping.primary }))
	}, [
		mapping,
		mode,
	])

	const handlePrimaryMouseOut = useCallback(() => {
		store.set(() => ({ activeKeys: null }))
	}, [])

	const handleSecondaryMouseOver = useCallback(() => {
		store.set(() => ({ activeKeys: mapping.secondary }))
	}, [
		mapping,
		mode,
	])

	const handleSecondaryMouseOut = useCallback(() => {
		store.set(() => ({ activeKeys: null }))
	}, [])

	const isPrimaryActive = useMemo(() => {
		return (activeKeys !== null) && (activeKeys === mapping.primary)
	}, [
		activeKeys,
		mapping,
	])

	const isSecondaryActive = useMemo(() => {
		return (activeKeys !== null) && (activeKeys === mapping.secondary)
	}, [
		activeKeys,
		mapping,
	])

	const compiledLabelClassName = useMemo(() => {
		return classnames(styles['mapping-label'], {
			[styles['is-active']]: isPrimaryActive || isSecondaryActive,
		})
	}, [
		activeKeys,
		isPrimaryActive,
		isSecondaryActive,
	])

	return (
		<>
			<div
				className={compiledLabelClassName}
				onMouseOut={handlePrimaryMouseOut}
				onMouseOver={handlePrimaryMouseOver}>
				{control.label}
			</div>

			<KeyboardMapping
				className={styles['mapping']}
				onClick={handlePrimaryMappingClick}
				onMouseOut={handlePrimaryMouseOut}
				onMouseOver={handlePrimaryMouseOver}>
				{mapping.primary?.map(code => {
					if (mode === 'keyboard') {
						return (
							<KeyboardKey
								key={code}
								code={code}
								isPressed={activeKeys === mapping.primary} />
						)
					}

					console.log(gamepad)
					// const buttonIndex = code[1]
					// const button = gamepad.state.buttons[buttonIndex]

					return null

					// return (
					// 	<GamepadSpritesheet
					// 		height={button.size.height}
					// 		isPressed={Boolean(button.isPressed)}
					// 		source={gamepad.spritesheet}
					// 		sourceX={button.sourcePosition.x}
					// 		sourceY={button.sourcePosition.y}
					// 		sprite={buttonIndex}
					// 		width={button.size.width} />
					// )
				})}
			</KeyboardMapping>

			<KeyboardMapping
				className={styles['mapping']}
				onClick={handleSecondaryMappingClick}
				onMouseOut={handleSecondaryMouseOut}
				onMouseOver={handleSecondaryMouseOver}>
				{mapping.secondary?.map(code => {
					return (
						<KeyboardKey
							key={code}
							code={code}
							isPressed={activeKeys === mapping.secondary} />
					)
				})}
			</KeyboardMapping>
		</>
	)
}

MappingRow.propTypes = {
	mode: PropTypes.oneOf([
		'gamepad',
		'keyboard',
	]).isRequired,
}
