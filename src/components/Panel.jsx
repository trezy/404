// Module imports
import classnames from 'classnames'
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
 * @param {string} [props.id] A unique identifier which allows this component to transition between different layouts.
 */
export function Panel(props) {
	const {
		children,
		className,
		columnSpan,
		id,
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
		<div
			className={compiledClassName}
			id={id}>
			{children}
		</div>
	)
}

Panel.defaultProps = {
	children: null,
	className: '',
	columnSpan: 1,
	id: null,
	isCentered: false,
	isPrimary: false,
}

Panel.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	columnSpan: PropTypes.oneOf([1, 2, 3, 4]),
	id: PropTypes.string,
	isCentered: PropTypes.bool,
	isPrimary: PropTypes.bool,
}
