// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './Table.module.scss'

import { TableRow } from './TableRow.jsx'





export function Table(props) {
	const {
		className,
		columns,
		data,
		isRowSelected,
	} = props

	const compiledClassName = classnames(styles['table'], className)

	const mappedData = useMemo(() => {
		return data.map((datum, index) => {
			const isSelected = (typeof isRowSelected === 'function') ? isRowSelected(datum) : undefined
			return (
				<TableRow
					key={index}
					columns={columns}
					datum={datum}
					isSelected={isSelected} />
			)
		})
	}, [
		columns,
		data,
		isRowSelected,
	])

	return (
		<div className={compiledClassName}>
			{mappedData}
		</div>
	)
}

Table.defaultProps = {
	className: '',
	children: null,
	isRowSelected: undefined
}

Table.propTypes = {
	className: PropTypes.string,
	columns: PropTypes.arrayOf(PropTypes.shape({
		component: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node,
		]),
		key: PropTypes.string.isRequired,
		label: PropTypes.string,
	})).isRequired,
	data: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.string,
	})).isRequired,
	isRowSelected: PropTypes.func,
}
