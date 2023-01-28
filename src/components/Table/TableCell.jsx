// Module imports
import { createElement } from 'react'
import PropTypes from 'prop-types'





// Local imports
import styles from './TableCell.module.scss'





export function TableCell(props) {
	const {
		column,
		datum,
	} = props

	const { component } = column

	if (typeof component === 'function') {
		return createElement(component, {
			...column,
			...datum,
		}, datum[column.key])
	}

	return (
		<div className={styles['cell']}>
			{datum[column.key]}
		</div>
	)
}

TableCell.propTypes = {
	column: PropTypes.shape({
		component: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node,
		]),
		key: PropTypes.string.isRequired,
		label: PropTypes.string,
	}).isRequired,
	datum: PropTypes.object.isRequired,
}
