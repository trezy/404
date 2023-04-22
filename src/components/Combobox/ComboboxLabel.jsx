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
		isNavGroupDefault,
		isOpen,
		labelClassName,
		navGroupID,
		navGroupLinks,
		selectedOption,
	} = useComboboxContext()

	const nodeID = useMemo(() => (id ?? `${comboboxID}-label`), [
		comboboxID,
		id,
	])

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
			id={id}
			// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
			tabIndex={0}>
			<ComboboxButton
				className={styles['button']}
				id={nodeID}
				isNavGroupDefault={isNavGroupDefault}
				navGroupID={navGroupID}
				navGroupLinks={navGroupLinks}
				onActivate={handleLabelActivate}
				onKeyUp={handleLabelKeyUp}>
				{selectedOption?.label ?? selectedOption?.value ?? emptyMessage}
			</ComboboxButton>
		</label>
	)
}
