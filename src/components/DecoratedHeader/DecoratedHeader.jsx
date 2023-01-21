// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './DecoratedHeader.module.scss'





export function DecoratedHeader(props) {
	const {
		children,
		className,
	} = props

	const compiledClassName = useMemo(() => {
		return classnames(styles['decorated-header'], className)
	}, [className])

	return (
		<header className={compiledClassName}>
			<h2>{children}</h2>
		</header>
	)
}

DecoratedHeader.defaultProps = {
	children: null,
	className: '',
}

DecoratedHeader.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
}
