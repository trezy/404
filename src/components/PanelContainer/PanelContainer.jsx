// Module imports
import PropTypes from 'prop-types'





// Local imports
import styles from './PanelContainer.module.scss'





/**
 * Allows multiple panels to be stacked.
 * @param {*} props
 */
export function PanelContainer(props) {
	const {
		menu,
		panels,
	} = props

	return (
		<div className={styles['panel-container']}>
			{panels.map((PanelItem, index) => (
				<PanelItem key={index} />
			))}

			{Boolean(menu) && (
				<div className={styles['menu-container']}>
					<menu type={'toolbar'}>
						{menu}
					</menu>
				</div>
			)}
		</div>
	)
}

PanelContainer.defaultProps = {
	menu: null,
}

PanelContainer.propTypes = {
	menu: PropTypes.node,
	panels: PropTypes.array.isRequired,
}
