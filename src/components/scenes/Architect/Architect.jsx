// Module imports
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'





// Local imports
import styles from './Architect.module.scss'

import { MapEditor } from '../../MapEditor/MapEditor.jsx'
import { ResourcepackEditor } from '../../ResourcepackEditor/ResourcepackEditor.jsx'
import { Scene } from '../../Scene/Scene.jsx'
import { Tabs } from '../../Tabs/Tabs.jsx'





// Constants
const TABS = [
	{
		id: 'resourcepack-editor',
		label: 'Resourcepack Editor',
	},
	{
		id: 'map-editor',
		label: 'Map Editor',
	},
]
const VARIANTS = {
	animate: {
		opacity: 1,
	},

	exit: {
		opacity: 0,
	},

	initial: {
		opacity: 0,
	},
}





/**
 * Renders the Architect — a wrapper around the asset and map editors.
 */
export function Architect() {
	const [activeTab, setActiveTab] = useState('map-editor')

	return (
		<Scene
			key={'loading-game'}
			animate={'animate'}
			className={styles['architect']}
			exit={'exit'}
			initial={'initial'}
			variants={VARIANTS}>
			<Tabs
				activeTabID={activeTab}
				className={styles['tabs']}
				onFocus={setActiveTab}
				tabs={TABS} />

			<AnimatePresence mode={'wait'}>
				{(activeTab === 'resourcepack-editor') && (
					<ResourcepackEditor key={'resourcepack-editor'} />
				)}

				{(activeTab === 'map-editor') && (
					<MapEditor key={'map-editor'} />
				)}
			</AnimatePresence>
		</Scene>
	)
}
