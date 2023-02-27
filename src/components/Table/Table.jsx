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
		rowClassName,
		showHeader,
	} = props

	const compiledClassName = classnames(styles['table'], className)
	const compiledRowClassName = classnames(styles['row'], rowClassName)

	const headers = useMemo(() => {
		if (showHeader) {
			const className = classnames(styles['header'], styles['row'])

			const headerCells = columns.map(column => {
				return (
					<div>{column.label}</div>
				)
			})

			return (
				<div
					className={className}
					style={{
						gridTemplateColumns: columns
							.map(column => column.width || '1fr')
							.join(' '),
					}}>
					{headerCells}
				</div>
			)
		}

		return null
	}, [
		columns,
		showHeader,
	])

	const mappedData = useMemo(() => {
		return data.map((datum, index) => {
			const isSelected = (typeof isRowSelected === 'function') ? isRowSelected(datum) : undefined
			return (
				<TableRow
					key={index}
					className={compiledRowClassName}
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
			{headers}
			{mappedData}
		</div>
	)
}

Table.defaultProps = {
	className: '',
	children: null,
	isRowSelected: undefined,
	showHeader: false,
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
	rowClassName: PropTypes.string,
	showHeader: PropTypes.bool,
}
