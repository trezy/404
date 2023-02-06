// Module imports
import { useCallback } from 'react'
import { useStore } from 'statery'




// Local imports
import {
	closeMap,
	focusTab,
	store,
} from './store.js'
import { Tabs } from '../Tabs/Tabs.jsx'





/**
 * Renders the map editor.
 */
export function OpenItemTabs() {
	const {
		activeTabID,
		openItems,
	} = useStore(store)

	const handleCloseTab = useCallback(tabID => closeMap(tabID), [])

	const handleFocusTab = useCallback(tabID => focusTab(tabID), [])

	return (
		<Tabs
			activeTabID={activeTabID}
			onClose={handleCloseTab}
			onFocus={handleFocusTab}
			showClose
			tabs={openItems} />
	)
}
