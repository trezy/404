// Module imports
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useStore } from 'statery'





// Local imports
import styles from './MappingTable.module.scss'

import { MappingRow } from './MappingRow.jsx'
import { store } from '../../newStore/store.js'





/**
 * Manage keyboard and mouse settings.
 */
export function MappingTable(props) {
	const {
		mode,
		onMappingClick,
	} = props

	const { controls } = useStore(store)

	const mappedMappings = useMemo(() => {
		return controls.map(control => {
			return (
				<MappingRow
					key={control.label}
					control={control}
					mapping={control.mappings[mode]}
					mode={mode}
					onMappingClick={onMappingClick} />
			)
		})
	}, [
		controls,
		mode,
	])

	return (
		<div className={styles['mappings-table']}>
			<header>{'Control'}</header>
			<header>{'Primary'}</header>
			<header>{'Secondary'}</header>

			{mappedMappings}
		</div>
	)
}

MappingTable.propTypes = {
	mappings: PropTypes.object,
	mode: PropTypes.oneOf([
		'gamepad',
		'keyboard',
	]).isRequired,
}
