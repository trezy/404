// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './PanelContainer.module.scss'





/**
 * Allows multiple panels to be stacked.
 * @param {*} props
 */
export function PanelContainer(props) {
	const {
		className,
		menu,
		panels,
	} = props

	const compiledClassName = useMemo(() => {
		return classnames(styles['panel-container'], className)
	}, [className])

	return (
		<div className={compiledClassName}>
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
	className: '',
	menu: null,
}

PanelContainer.propTypes = {
	className: PropTypes.string,
	menu: PropTypes.node,
	panels: PropTypes.array.isRequired,
}
