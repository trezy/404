// Module imports
import { useMemo } from 'react'
import PropTypes from 'prop-types'





export function Meter(props) {
	const {
		maximum,
		minimum,
		showSegments,
		value,
	} = props

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
		while (index < range) {
			segments.push((
				<div
					key={index}
					className="meter-segment" />
			))

			index += 1
		}

		return (
			<div className="meter-segments">
				{segments}
			</div>
		)
	}, [range])

	return (
		<div className="meter">
			<div
				className="meter-fill"
				style={{
					width: `${fillPercentage}%`,
				}} />

			{showSegments && meterSegments}
		</div>
	)
}

Meter.defaultProps = {
	maximum: 100,
	minimum: 0,
	showSegments: true,
}

Meter.propTypes = {
	maximum: PropTypes.number,
	minimum: PropTypes.number,
	showSegments: PropTypes.bool,
	value: PropTypes.number.isRequired,
}
