// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './PanelContent.module.scss'





export function PanelContent(props) {
	const {
		children,
		className,
	} = props

	const compiledClassName = useMemo(() => {
		return classnames(styles['panel-content'], className)
	}, [className])

	return (
		<div
			{...props}
			className={compiledClassName}>
			{children}
		</div>
	)
}

PanelContent.defaultProps = {
	children: null,
}

PanelContent.propTypes = {
	children: PropTypes.node,
}
