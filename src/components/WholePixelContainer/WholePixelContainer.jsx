// Module imports
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import styles from './WholePixelContainer.module.scss'





/**
 * A wrapper for ensuring its contents will always be divisible by the current UI scale.
 *
 * @param {object} props All component props.
 * @param {*} [props.children] Node to be rendered inside of the container.
 */
export function WholePixelContainer(props) {
	const {
		children,
		className,
	} = props

	const containerRef = useRef()
	const [state, setState] = useState({
		height: 0,
		width: 0,
	})

	const compiledClassName = classnames(styles['whole-pixel-container'], className)

	const updateSize = useCallback(() => {
		const containerElement = containerRef.current

		if (!containerElement) {
			return
		}

		const rootElement = document.querySelector(':root')
		const rootElementStyles = getComputedStyle(rootElement)
		const uiScale = Number(rootElementStyles.getPropertyValue('--ui-scale'))

		const parentHeight = containerElement.parentElement.clientHeight
		const parentWidth = containerElement.parentElement.clientWidth

		const height = Math.floor(parentHeight / uiScale) * uiScale
		const width = Math.floor(parentWidth / uiScale) * uiScale

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
			className={compiledClassName}
			ref={containerRef}
			style={state}>
			{children}
		</div>
	)
}

WholePixelContainer.defaultProps = {
	children: null,
	className: '',
}

WholePixelContainer.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
}
