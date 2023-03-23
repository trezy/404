// Module imports
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './ComboboxOptionGroup.module.scss'

import { ComboboxOption } from './ComboboxOption.jsx'
import { useComboboxContext } from './Combobox.jsx'





export function ComboboxOptionGroup(props) {
	const {
		name,
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
			.map(option => {
				return (
					<ComboboxOption
						key={generateOptionKey(option)}
						option={option} />
				)
			})
	}, [
		generateOptionKey,
		name,
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
	shouldShowLabel: true,
}

ComboboxOptionGroup.propTypes = {
	name: PropTypes.string.isRequired,
	shouldShowLabel: PropTypes.bool,
}
