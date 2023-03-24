// Module imports
import {
	useMemo,
	useRef,
} from 'react'
import classnames from 'classnames'





// Local imports
import styles from './ComboboxContainer.module.scss'

import { ComboboxLabel } from './ComboboxLabel.jsx'
import { ComboboxOptions } from './ComboboxOptions.jsx'
import { useComboboxContext } from './Combobox.jsx'
import { useForeignInteractionHandler } from '../../hooks/useForeignInteractionHandler.js'





export function ComboboxContainer() {
	const ref = useRef(null)

	const {
		className,
		hideOptions,
		isDisabled,
		isOpen,
	} = useComboboxContext()

	const compiledClassName = useMemo(() => {
		return classnames(styles['combobox'], className, {
			[styles['is-disabled']]: isDisabled,
			[styles['is-open']]: isOpen,
		})
	}, [
		className,
		isDisabled,
		isOpen,
	])

	useForeignInteractionHandler(ref, hideOptions)

	return (
		<div
			className={compiledClassName}
			ref={ref}>
			<ComboboxLabel />

			{isOpen && (
				<ComboboxOptions />
			)}
		</div>
	)
}
