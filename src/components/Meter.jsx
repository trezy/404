// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





/**
 * A meter component for displaying a value within a range.
 *
 * @param {object} props All component props.
 * @param {string} [props.className] A string of classes to be set on the meter.
 * @param {boolean} [props.isFullWidth = false] Whether or not this meter should take up the full width of its container.
 * @param {number} [props.maximum = 100] The maximum value of the meter.
 * @param {number} [props.minimum = 0] The minimum value of the meter.
 * @param {number} [props.segmentSize = 20] How large the segments of the meter should be. Must be between `minimum` and `maximum`.
 * @param {boolean} [props.showSegments = true] Whether or not to show the segments of this meter.
 * @param {number} props.value The value of the meter. Must be between `minimum` and `maximum`.
 */
export function Meter(props) {
	const {
		className,
		isFullWidth,
		maximum,
		minimum,
		segmentSize,
		showSegments,
		value,
	} = props

	const compiledClassName = useMemo(() => {
		return classnames('meter', className, {
			'is-full-width': isFullWidth,
		})
	}, [
		className,
		isFullWidth,
	])

	const range = useMemo(() => maximum - minimum, [
		maximum,
		minimum,
	])

	const fillStyles = useMemo(() => {
		return {
			width: `${Math.floor((value / range) * 100)}%`,
		}
	}, [
		range,
		value,
	])

	const meterSegments = useMemo(() => {
		const segments = []

		let index = 0
		while (index < Math.ceil(range / segmentSize)) {
			segments.push((
				<div
					key={index}
					className={'meter-segment'} />
			))

			index += 1
		}

		return segments
	}, [
		range,
		segmentSize,
	])

	return (
		<div
			aria-valuemax={maximum}
			aria-valuemin={minimum}
			aria-valuenow={value}
			className={compiledClassName}
			role={'meter'}>
			<div
				aria-hidden
				className={'meter-fill'}
				style={fillStyles} />

			{showSegments && (
				<div
					aria-hidden
					className={'meter-segments'}>
					{meterSegments}
				</div>
			)}
		</div>
	)
}

Meter.defaultProps = {
	className: '',
	isFullWidth: false,
	maximum: 100,
	minimum: 0,
	segmentSize: 20,
	showSegments: true,
}

Meter.propTypes = {
	className: PropTypes.string,
	isFullWidth: PropTypes.bool,
	maximum: PropTypes.number,
	minimum: PropTypes.number,
	segmentSize: PropTypes.number,
	showSegments: PropTypes.bool,
	value: PropTypes.number.isRequired,
}
