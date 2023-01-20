// Module imports
import { useMemo } from 'react'





// Local imports
import styles from './OpenItemTabs.module.scss'

import { Tabs } from '../Tabs/Tabs.jsx'
import { useEditorContext } from '../Editor/Context/useEditorContext.js'





/**
 * Renders a list of open tab items for the Map Editor.
 */
export function OpenItemTabs() {
	const {
		closeItem,
		openItems,
		focusItem,
		focusedItemID,
	} = useEditorContext()

	const tabs = useMemo(() => {
		return Object.entries(openItems).map(([id, { item }]) => {
			return {
				id,
				label: item.name,
			}
		})
	}, [openItems])

	return (
		<Tabs
			activeTabID={focusedItemID}
			className={styles['tabs']}
			onClose={closeItem}
			onFocus={focusItem}
			showClose
			tabs={tabs} />
	)
}
