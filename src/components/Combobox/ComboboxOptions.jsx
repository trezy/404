// Module imports
import {
	useId as useID,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react'





// Local imports
import styles from './ComboboxOptions.module.scss'

import { ComboboxOptionGroup } from './ComboboxOptionGroup.jsx'
import { useComboboxContext } from './Combobox.jsx'
import { useNavGraphContext } from '../NavGraph/NavGraphContextProvider.jsx'





export function ComboboxOptions() {
	const {
		comboboxID,
		isOpen,
		options,
	} = useComboboxContext()

	const navGroupID = useID()
	const returnNodeRef = useRef(null)

	const {
		currentTargetNodeID,
		focusNode,
	} = useNavGraphContext()

	const mappedOptionGroups = useMemo(() => {
		// Collect a list of all the groups that exist
		const groupSet = options.reduce((accumulator, option) => {
			accumulator.add(option.group || 'Other')
			return accumulator
		}, new Set)

		const groupNames = Array.from(groupSet)

		return groupNames.map((groupName, index) => {
			return (
				<ComboboxOptionGroup
					key={groupName}
					isNavGroupDefault={index === 0}
					name={groupName}
					navGroupID={navGroupID}
					shouldShowLabel={groupNames.length > 1} />
			)
		})
	}, [
		navGroupID,
		options,
	])

	// useLayoutEffect(() => {
	// 	if (isOpen && (returnNodeRef.current === null)) {
	// 		returnNodeRef.current = currentTargetNodeID
	// 		focusNode(navGroupID)

	// 		return () => focusNode(returnNodeRef.current)
	// 	}
	// }, [
	// 	currentTargetNodeID,
	// 	focusNode,
	// 	isOpen,
	// 	navGroupID,
	// 	returnNodeRef,
	// ])

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
