// Module imports
import { useMemo } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





export function Button(props) {
	const {
		children,
		isDisabled,
		isPrimary,
		isText,
		onClick,
		type,
	} = props

	const className = useMemo(() => {
		return classnames(props.className, {
			'is-primary': isPrimary,
			'is-text': isText,
		})
	}, [
		isPrimary,
		isText,
		props.className,
	])

	const ariaAndDataProps = useMemo(() => {
		return Object.entries(props).reduce((accumulator, [key, value]) => {
			if (key.startsWith('aria-') || key.startsWith('data-')) {
				accumulator[key] = value
			}

			return accumulator
		}, {})
	}, [props])

	return (
		<button
			className={className}
			disabled={isDisabled}
			onClick={onClick}
			type={type}
			{...ariaAndDataProps}>
			{children}
		</button>
	)
}

Button.defaultProps = {
	children: null,
	className: '',
	isDisabled: false,
	isPrimary: false,
	isText: false,
	onClick: () => {},
	type: 'button',
}

Button.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	isDisabled: PropTypes.bool,
	isPrimary: PropTypes.bool,
	isText: PropTypes.bool,
	onClick: PropTypes.func,
	type: PropTypes.oneOf([
		'button',
		'submit',
	]),
}
