// Module imports
import {
	useMemo,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import styles from './Timer.module.scss'

import { useRequestAnimationFrame } from '../../hooks/useRequestAnimationFrame.js'





/**
 * A timer to represent the amount of time that has passed during the current map session.
 *
 * @param {object} props All component props.
 * @param {string} [props.className] A string of classes to be set on the timer.
 * @param {boolean} [props.isBordered = false] Whether or not this timer should have a border.
 * @param {boolean} [props.isCentered = false] Whether or not this timer should be centered horizontally.
 * @param {boolean} [props.isLarge = false] Whether or not this timer should be larger than normal.
 * @param {boolean} [props.isMonospace = false] Whether or not the numbers of this timer should be monospaced.
 */
export function Timer(props) {
	const {
		className,
		isBordered,
		isCentered,
		isLarge,
		isMonospace,
	} = props
	const [currentTime, setCurrentTime] = useState([0, 0])
	const [startTimestamp] = useState(performance.now())

	const compiledClassName = useMemo(() => {
		return classnames(styles['timer'], className, {
			[styles['is-bordered']]: isBordered,
			[styles['is-centered']]: isCentered,
			[styles['is-large']]: isLarge,
			[styles['is-monospace']]: isMonospace,
		})
	}, [
		isBordered,
		isCentered,
		isLarge,
		isMonospace,
		className,
	])

	const renderedTime = useMemo(() => {
		const result = currentTime
			.map(value => String(value).padStart(2, '0'))
			.join(':')

		if (isMonospace) {
			return result
				.split('')
				.reduce((accumulator, character, index) => {
					accumulator.push((
						<span key={index}>
							{character}
						</span>
					))

					return accumulator
				}, [])
		}

		return currentTime
	}, [
		currentTime,
		isMonospace,
	])

	useRequestAnimationFrame(() => {
		setCurrentTime(() => {
			const delta = performance.now() - startTimestamp

			return [
				Math.floor(delta / 1000 / 60),
				Math.floor((delta / 1000) % 60),
			]
		})
	}, [
		currentTime,
		setCurrentTime,
		startTimestamp,
	])

	return (
		<time className={compiledClassName}>
			<span className={styles['time-wrapper']}>
				{renderedTime}
			</span>
		</time>
	)
}

Timer.defaultProps = {
	className: '',
	isBordered: false,
	isCentered: false,
	isLarge: false,
	isMonospace: false,
}

Timer.propTypes = {
	className: PropTypes.string,
	isBordered: PropTypes.bool,
	isCentered: PropTypes.bool,
	isLarge: PropTypes.bool,
	isMonospace: PropTypes.bool,
}
