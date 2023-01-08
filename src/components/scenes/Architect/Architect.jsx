// Module imports
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'





// Local imports
import { AssetPackCreator } from './AssetPackCreator/AssetPackCreator.jsx'
import { MapEditor } from '../../MapEditor/MapEditor.jsx'
import { Tabs } from '../../Tabs.jsx'





// Constants
const TABS = [
	{
		id: 'asset-creator',
		label: 'Asset Creator',
	},
	{
		id: 'map-editor',
		label: 'Map Editor',
	},
]





/**
 * Renders the Architect — a wrapper around the asset and map editors.
 */
export function Architect() {
	const [activeTab, setActiveTab] = useState('map-editor')

	return (
		<div className={'architect scene'}>
			<Tabs
				activeTabID={activeTab}
				onFocus={setActiveTab}
				tabs={TABS} />

			<AnimatePresence exitBeforeEnter>
				{(activeTab === 'asset-creator') && (
					<AssetPackCreator key={'asset-creator'} />
				)}

				{(activeTab === 'map-editor') && (
					<MapEditor key={'map-editor'} />
				)}
			</AnimatePresence>
		</div>
	)
}
