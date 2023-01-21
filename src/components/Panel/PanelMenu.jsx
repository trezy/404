// Module imports
import PropTypes from 'prop-types'





// Local imports
import styles from './PanelMenu.module.scss'





export function PanelMenu(props) {
	const { children } = props

	return (
		<div className={styles['panel-menu']}>
			{children}
		</div>
	)
}

PanelMenu.defaultProps = {
	children: null,
}

PanelMenu.propTypes = {
	children: PropTypes.node,
}
