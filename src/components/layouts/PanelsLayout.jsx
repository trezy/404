// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'





/**
 * A wrapper for panel layouts.
 *
 * @param {object} props All component props.
 * @param {*} [props.children] Node to be rendered inside of the layout.
 * @param {string} [props.className] A string of classes to be set on the layout wrapper.
 * @param {string} [props.id] A unique identifier for the layout wrapper.
 */
export function PanelsLayout(props) {
	const {
		children,
		className,
		id,
	} = props

	const compiledClassName = classnames('layout', 'panels', className)

	return (
		<div
			className={compiledClassName}
			id={id}>
			{children}
		</div>
	)
}

PanelsLayout.defaultProps = {
	children: null,
	className: '',
	id: '',
}

PanelsLayout.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	id: PropTypes.string,
}
