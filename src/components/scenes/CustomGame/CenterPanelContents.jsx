// Module imports
import {
	useEffect,
	useMemo,
	useState,
} from 'react'





// Local imports
import styles from './CenterPanelContents.module.scss'

import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { MapCard } from './MapCard.jsx'
import { Modal } from '../../Modal/Modal.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Custom Game scene.
 */
export function CenterPanelContents() {
	const contentManager = useStore(state => state.contentManager)

	const [isLoadingMaps, setIsLoadingMaps] = useState(true)

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
		setIsLoadingMaps(true)

		executePromiseWithMinimumDuration(contentManager.loadMeta(), 2000)
			.then(() => {
				return setIsLoadingMaps(false)
			})
			.catch(() => {
				console.log('Error loading maps!')
			})
	}, [
		contentManager,
		setIsLoadingMaps,
	])

	return (
		<>
			<header className={'decorated-header'}>
				<h2>{'Map Select'}</h2>
			</header>

			<div className={'panel-content'}>
				<div className={styles['map-list']}>
					{!isLoadingMaps && (
						<ul>
							{mappedMaps}
						</ul>
					)}
				</div>
			</div>

			{isLoadingMaps && (
				<Modal
					isLoading
					title={'Loading maps...'} />
			)}
		</>
	)
}
