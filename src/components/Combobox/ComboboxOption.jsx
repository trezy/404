// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import styles from './ComboboxOption.module.scss'

import { ComboboxButton } from './ComboboxButton.jsx'
import { useComboboxContext } from './Combobox.jsx'





export function ComboboxOption(props) {
	const { option } = props

	const {
		generateOptionKey,
		handleOptionActivate,
		handleOptionKeyUp,
		selectedOption,
	} = useComboboxContext()

	const optionID = useMemo(() => generateOptionKey(option), [
		generateOptionKey,
		option,
	])

	const handleActivate = useCallback(() => {
		handleOptionActivate(option)
	}, [
		handleOptionActivate,
		option,
	])

	const handleKeyUp = useCallback(event => {
		handleOptionKeyUp(event, option)
	}, [
		handleOptionKeyUp,
		option,
	])

	const isSelected = useMemo(() => selectedOption === option, [
		option,
		selectedOption,
	])

	const compiledButtonClassName = useMemo(() => {
		return classnames({
			[styles['is-selected']]: isSelected,
		})
	}, [isSelected])

	return (
		<div
			key={optionID}
			aria-selected={isSelected}
			id={optionID}
			role={'option'} >
			{/* eslint-disable-next-line react/forbid-elements */}
			<ComboboxButton
				className={compiledButtonClassName}
				onActivate={handleActivate}
				onKeyUp={handleKeyUp}>
				{option.label ?? option.value}
			</ComboboxButton>
		</div>
	)
}

ComboboxOption.propTypes = {
	option: PropTypes.shape({
		group: PropTypes.string,
		label: PropTypes.string,
		value: PropTypes.any.isRequired,
	}).isRequired,
}
