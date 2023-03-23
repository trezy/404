// Module imports
import classnames from 'classnames'
import { useMemo } from 'react'





// Local imports
import styles from './ComboboxLabel.module.scss'

import { ComboboxButton } from './ComboboxButton.jsx'
import { useComboboxContext } from './Combobox.jsx'





export function ComboboxLabel() {
	const {
		comboboxID,
		emptyMessage,
		generateOptionKey,
		handleLabelActivate,
		handleLabelKeyUp,
		id,
		isOpen,
		labelClassName,
		selectedOption,
	} = useComboboxContext()

	const compiledClassName = useMemo(() => {
		return classnames(labelClassName, styles['combobox-label'], {
			[styles['is-open']]: isOpen,
		})
	}, [
		isOpen,
		labelClassName,
	])

	return (
		<label
			aria-activedescendant={selectedOption ? generateOptionKey(selectedOption) : null}
			className={compiledClassName}
			id={`${comboboxID}-label`}
			// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
			tabIndex={0}>
			<ComboboxButton
				className={styles['button']}
				id={id}
				onActivate={handleLabelActivate}
				onKeyUp={handleLabelKeyUp}>
				{selectedOption?.label ?? selectedOption?.value ?? emptyMessage}
			</ComboboxButton>
		</label>
	)
}
