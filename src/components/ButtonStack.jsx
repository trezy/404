// Module imports
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





/**
 * A wrapper for groups of buttons.
 *
 * @param {object} props All component props.
 * @param {*} [props.children] Node to be rendered inside of the button.
 * @param {string} [props.className] A string of classes to be set on the button.
 */
export function ButtonStack(props) {
	const {
		children,
		className,
	} = props

	const compiledClassName = useMemo(() => classNames('button-stack', className), [className])

	return (
		<menu className={compiledClassName}>
			{children}
		</menu>
	)
}

ButtonStack.defaultProps = {
	children: null,
	className: '',
}

ButtonStack.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
}
