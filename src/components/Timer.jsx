// Module imports
import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





export function Timer(props) {
	const {
		isBordered,
		isCentered,
		isLarge,
		isMonospace,
	} = props
	const [currentTime, setCurrentTime] = useState([0, 0])
	const [startTimestamp] = useState(performance.now())

	const className = useMemo(() => {
		return classnames('timer', props.className, {
			'is-bordered': isBordered,
			'is-centered': isCentered,
			'is-large': isLarge,
			'is-monospace': isMonospace,
		})
	}, [
		isBordered,
		isCentered,
		isLarge,
		isMonospace,
		props.className,
	])

	const renderedTime = useMemo(() => {
		let result = currentTime
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

	useEffect(() => {
		let shouldContinue = true

		const loop = () => {
			if (!shouldContinue) {
				return
			}

			setCurrentTime(() => {
				const delta = performance.now() - startTimestamp

				return [
					Math.floor(delta / 1000 / 60),
					Math.floor((delta / 1000) % 60),
				]
			})

			requestAnimationFrame(loop)
		}

		loop()

		return () => {
			shouldContinue = false
		}
	}, [
		currentTime,
		setCurrentTime,
	])

	return (
		<time className={className}>
			{renderedTime}
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
