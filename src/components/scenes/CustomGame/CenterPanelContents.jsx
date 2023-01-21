// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
} from 'react'





// Local imports
import styles from './CenterPanelContents.module.scss'

import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'
import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { MapCard } from './MapCard.jsx'
import { usePanelContext } from '../../Panel/Context/usePanelContext.js'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Custom Game scene.
 */
export function CenterPanelContents() {
	const {
		contentManager,
		goToLoadingMap,
	} = useStore(state => {
		return {
			contentManager: state.contentManager,
			goToLoadingMap: state.goToLoadingMap,
		}
	})

	const {
		isLoading: isPanelLoading,
		setIsLoading: setIsPanelLoading,
	} = usePanelContext()

	const handleMapPlay = useCallback(mapID => {
		goToLoadingMap(mapID)
	}, [goToLoadingMap])

	const mappedMaps = useMemo(() => {
		return Object
			.values(contentManager.maps)
			.map(mapData => {
				return (
					<MapCard
						key={mapData.id}
						map={mapData}
						onPlay={handleMapPlay} />
				)
			})
	}, [
		contentManager,
		handleMapPlay,
	])

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
			<DecoratedHeader>{'Map Select'}</DecoratedHeader>

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
