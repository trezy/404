// Module imports
import classnames from 'classnames'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





/**
 * A visual container for UI sections.
 *
 * @param {object} props All component props.
 * @param {*} [props.children] Node to be rendered inside of the panel.
 * @param {string} [props.className] A string of classes to be set on the panel.
 * @param {1 | 2 | 3 | 4} [props.columnSpan = 1] How many columns this panel should span.
 * @param {boolean} [props.isCentered = false] Whether or not the content of this panel should be centered (both horizontally and vertically).
 * @param {boolean} [props.isPrimary = false] Whether or not this button is a primary type panel.
 */
export function Panel(props) {
	const {
		children,
		className,
		columnSpan,
		isCentered,
		isPrimary,
	} = props

	const compiledClassName = useMemo(() => {
		return classnames('panel', `span-${columnSpan}`, className, {
			'is-centered': isCentered,
			'is-primary': isPrimary,
		})
	}, [
		columnSpan,
		className,
		isCentered,
		isPrimary,
	])

	return (
		<motion.div className={compiledClassName}>
			{children}
		</motion.div>
	)
}

Panel.defaultProps = {
	children: null,
	className: '',
	columnSpan: 1,
	isCentered: false,
	isPrimary: false,
}

Panel.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	columnSpan: PropTypes.oneOf([1, 2, 3, 4]),
	isCentered: PropTypes.bool,
	isPrimary: PropTypes.bool,
}
