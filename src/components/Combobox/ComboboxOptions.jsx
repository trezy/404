// Module imports
import { useMemo } from 'react'





// Local imports
import styles from './ComboboxOptions.module.scss'

import { ComboboxOptionGroup } from './ComboboxOptionGroup.jsx'
import { useComboboxContext } from './Combobox.jsx'





export function ComboboxOptions() {
	const {
		comboboxID,
		isOpen,
		options,
	} = useComboboxContext()

	const mappedOptionGroups = useMemo(() => {
		// Collect a list of all the groups that exist
		const groupSet = options.reduce((accumulator, option) => {
			accumulator.add(option.group || 'Other')
			return accumulator
		}, new Set)

		const groupNames = Array.from(groupSet)

		return groupNames.map(groupName => {
			return (
				<ComboboxOptionGroup
					key={groupName}
					name={groupName}
					shouldShowLabel={groupNames.length > 1} />
			)
		})
	}, [options])

	return (
		<div
			aria-labelledby={`${comboboxID}-label`}
			className={styles['options']}
			hidden={!isOpen}
			role={'listbox'}
			tabIndex={-1}>
			{mappedOptionGroups}
		</div>
	)
}
