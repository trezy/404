// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'





export function WholePixelContainer(props) {
	const { children } = props
	const [state, setState] = useState({
		height: 0,
		width: 0,
	})

	const updateSize = useCallback(() => {
		const rootElement = document.querySelector(':root')
		const rootElementStyles = getComputedStyle(rootElement)
		const uiScale = Number(rootElementStyles.getPropertyValue('--ui-scale'))

		const viewportHeight = window.innerHeight
		const viewportWidth = window.innerWidth

		const height = Math.floor(viewportHeight / uiScale) * uiScale
		const width = Math.floor(viewportWidth / uiScale) * uiScale

		setState({
			height,
			width,
		})
	}, [setState])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			updateSize()

			window.addEventListener('resize', updateSize)

			return () => window.removeEventListener('resize', updateSize)
		}
	}, [updateSize])

	return (
		<div
			id="whole-pixel-container"
			style={state}>
			{children}
		</div>
	)
}

WholePixelContainer.defaultProps = {
	children: null,
}

WholePixelContainer.propTypes = {
	children: PropTypes.node,
}
