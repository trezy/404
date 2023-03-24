// Module imports
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './ComboboxOptionGroup.module.scss'

import { ComboboxOption } from './ComboboxOption.jsx'
import { useComboboxContext } from './Combobox.jsx'





export function ComboboxOptionGroup(props) {
	const {
		isNavGroupDefault,
		name,
		navGroupID,
		shouldShowLabel,
	} = props

	const {
		generateOptionKey,
		options,
	} = useComboboxContext()

	const mappedOptions = useMemo(() => {
		return options
			.filter(option => {
				if (name === 'Other') {
					return !option.group || (option.group === 'Other')
				}

				return option.group === name
			})
			.map((option, index) => {
				return (
					<ComboboxOption
						key={generateOptionKey(option)}
						isNavGroupDefault={isNavGroupDefault && (index === 0)}
						navGroupID={navGroupID}
						option={option} />
				)
			})
	}, [
		generateOptionKey,
		isNavGroupDefault,
		name,
		navGroupID,
		options,
	])

	return (
		<div className={styles['options-group']}>
			{shouldShowLabel && (
				<header>{name}</header>
			)}

			{mappedOptions}
		</div>
	)
}

ComboboxOptionGroup.propTypes = {
	isNavGroupDefault: false,
	shouldShowLabel: true,
}

ComboboxOptionGroup.propTypes = {
	isNavGroupDefault: PropTypes.bool,
	name: PropTypes.string.isRequired,
	navGroupID: PropTypes.string.isRequired,
	shouldShowLabel: PropTypes.bool,
}
