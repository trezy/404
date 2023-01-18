// Module imports
import {
	useEffect,
	useMemo,
} from 'react'





// Local imports
import styles from './CenterPanelContents.module.scss'

import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { MapCard } from './MapCard.jsx'
import { usePanelContext } from '../../Panel/Context/usePanelContext.js'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Custom Game scene.
 */
export function CenterPanelContents() {
	const contentManager = useStore(state => state.contentManager)

	const {
		isLoading: isPanelLoading,
		setIsLoading: setIsPanelLoading,
	} = usePanelContext()

	const mappedMaps = useMemo(() => {
		return Object
			.values(contentManager.maps)
			.map(mapData => {
				return (
					<MapCard
						key={mapData.id}
						map={mapData} />
				)
			})
	}, [contentManager])

	useEffect(() => {
		setIsPanelLoading(true)

		executePromiseWithMinimumDuration(contentManager.loadMeta(), 2000)
			.then(() => {
				return setIsPanelLoading(false)
			})
			.catch(() => {
				console.log('Error loading maps!')
			})
	}, [
		contentManager,
		setIsPanelLoading,
	])

	return (
		<>
			<header className={'decorated-header'}>
				<h2>{'Map Select'}</h2>
			</header>

			<div className={'panel-content'}>
				<div className={styles['map-list']}>
					{!isPanelLoading && (
						<ul>
							{mappedMaps}
						</ul>
					)}
				</div>
			</div>
		</>
	)
}
