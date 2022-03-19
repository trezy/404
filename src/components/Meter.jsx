// Module imports
import { useMemo } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





export function Meter(props) {
	const {
		isFullWidth,
		maximum,
		minimum,
		segmentSize,
		showSegments,
		value,
	} = props

	const className = useMemo(() => {
		return classnames('meter', {
			'is-full-width': isFullWidth,
		})
	}, [props.className])

	const range = useMemo(() => maximum - minimum, [
		maximum,
		minimum,
	])

	const fillPercentage = useMemo(() => Math.floor((value / range) * 100), [
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
					className="meter-segment" />
			))

			index += 1
		}

		return segments
	}, [range])

	return (
		<div
			aria-valuemax={maximum}
			aria-valuemin={minimum}
			aria-valuenow={value}
			className={className}
			role="meter">
			<div
				aria-hidden
				className="meter-fill"
				style={{
					width: `${fillPercentage}%`,
				}} />

			{showSegments && (
				<div
					aria-hidden
					className="meter-segments">
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
	segmentSize: 1,
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
