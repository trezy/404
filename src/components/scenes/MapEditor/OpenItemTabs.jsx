// Module imports
import { useMemo } from 'react'





// Local imports
import { Tabs } from '../../Tabs.jsx'
import { useEditor } from './context/EditorContext.jsx'





/**
 * Renders a list of open tab items for the Map Editor.
 */
export function OpenItemTabs() {
	const {
		closeItem,
		openItems,
		focusItem,
		focusedItemID,
	} = useEditor()

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
			onClose={closeItem}
			onFocus={focusItem}
			showClose
			tabs={tabs} />
	)
}
