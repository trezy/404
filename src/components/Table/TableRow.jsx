// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './TableRow.module.scss'

import { TableCell } from './TableCell.jsx'





export function TableRow(props) {
	const {
		columns,
		datum,
		isSelected,
	} = props

	const children = useMemo(() => {
		return columns.map(column => {
			return (
				<TableCell
					key={column.key}
					column={column}
					datum={datum} />
			)
		})
	}, [
		columns,
		datum,
	])

	const compiledClassName = useMemo(() => {
		return classnames(styles['row'], {
			[styles['is-selected']]: isSelected,
		})
	}, [
		columns,
		isSelected,
	])

	const compiledStyles = useMemo(() => {
		return {
			gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
		}
	}, [columns])

	return (
		<div
			className={compiledClassName}
			style={compiledStyles}>
			{children}
		</div>
	)
}

TableRow.defaultProps = {
	className: '',
	children: null,
}

TableRow.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
}
