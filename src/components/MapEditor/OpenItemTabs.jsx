// Module imports
import { useCallback } from 'react'
import { useStore } from 'statery'




// Local imports
import {
	focusTabID,
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

	const handleFocusTab = useCallback(tabID => focusTabID(tabID), [focusTabID])

	return (
		<Tabs
			activeTabID={activeTabID}
			onFocus={handleFocusTab}
			tabs={openItems} />
	)
}
