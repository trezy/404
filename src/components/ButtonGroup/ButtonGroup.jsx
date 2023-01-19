// Module imports
import PropTypes from 'prop-types'





// Local imports
import styles from './ButtonGroup.module.scss'





/**
 * Renders a collection of buttons together with proper clipping.
 *
 * @component
 */
export function ButtonGroup(props) {
	const { children } = props

	return (
		<div className={styles['button-group']}>
			{children}
		</div>
	)
}

ButtonGroup.propTypes ={
	children: null,
}

ButtonGroup.propTypes ={
	children: PropTypes.node,
}
