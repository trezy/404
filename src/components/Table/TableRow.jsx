// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './TableRow.module.scss'

import { TableCell } from './TableCell.jsx'





export function TableRow(props) {
	const {
		className,
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
		return classnames(styles['row'], className, {
			[styles['is-selected']]: isSelected,
		})
	}, [
		className,
		columns,
		isSelected,
	])

	const compiledStyles = useMemo(() => {
		return {
			gridTemplateColumns: columns
				.map(column => column.width || '1fr')
				.join(' '),
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
