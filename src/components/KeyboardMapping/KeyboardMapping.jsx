// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './KeyboardMapping.module.scss'





export function KeyboardMapping(props) {
	const {
		children,
		className,
		onClick,
		onMouseOut,
		onMouseOver,
	} = props

	const compiledClassName = useMemo(() => {
		return classnames(styles['mapping'], className)
	}, [className])

	return (
		<div
			className={compiledClassName}
			onClick={onClick}
			onMouseOut={onMouseOut}
			onMouseOver={onMouseOver}>
			{children}
		</div>
	)
}

KeyboardMapping.defaultProps = {
	children: null,
	onClick: () => {},
	onMouseOut: () => {},
	onMouseOver: () => {},
}

KeyboardMapping.propTypes = {
	children: PropTypes.node,
	onClick: PropTypes.func,
	onMouseOut: PropTypes.func,
	onMouseOver: PropTypes.func,
}
