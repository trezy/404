// Module imports
import { motion } from 'framer-motion'
import classnames from 'classnames'
import PropTypes from 'prop-types'





export function Panel(props) {
	const {
		children,
		columnSpan,
		isCentered,
		isPrimary,
	} = props

	const className = classnames('panel', `span-${columnSpan}`, props.className, {
		'is-centered': isCentered,
		'is-primary': isPrimary,
	})

	return (
		<motion.div className={className}>
			{children}
		</motion.div>
	)
}

Panel.defaultProps = {
	children: null,
	columnSpan: 1,
	isCentered: false,
	isPrimary: false,
}

Panel.propTypes = {
	children: PropTypes.node,
	columnSpan: PropTypes.oneOf([1, 2, 3, 4]),
	isCentered: PropTypes.bool,
	isPrimary: PropTypes.bool,
}
