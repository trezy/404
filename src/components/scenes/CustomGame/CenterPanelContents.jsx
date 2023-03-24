// Module imports
import {
	useEffect,
	useMemo,
} from 'react'
import { useStore } from 'statery'





// Local imports
import styles from './CenterPanelContents.module.scss'

import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'
import { executePromiseWithMinimumDuration } from '../../../helpers/executePromiseWithMinimumDuration.js'
import { LOADING_MAP } from '../../../constants/SceneNames.js'
import { MapCard } from './MapCard.jsx'
import { PanelContent } from '../../Panel/PanelContent.jsx'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { selectMap } from '../../../newStore/helpers/selectMap.js'
import { store } from '../../../newStore/store.js'
import { useNavGraphContext } from '../../NavGraph/NavGraphContextProvider.jsx'
import { usePanelContext } from '../../Panel/Context/usePanelContext.js'





function handleMapPlay(mapID) {
	selectMap(mapID)
	pushScene(LOADING_MAP)
}

/**
 * Renders the contents of the center panel for the Custom Game scene.
 */
export function CenterPanelContents() {
	const { contentManager } = useStore(store)

	const { focusNode } = useNavGraphContext()

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
				focusNode(`play-map:${Object.keys(contentManager.maps)[0]}`)
				setIsPanelLoading(false)
				return true
			})
			.catch(() => {
				console.log('Error loading maps!')
			})
	}, [
		contentManager,
		focusNode,
		setIsPanelLoading,
	])

	return (
		<>
			<DecoratedHeader>{'Map Select'}</DecoratedHeader>

			<PanelContent>
				<div className={styles['map-list']}>
					{!isPanelLoading && (
						<ul>
							{mappedMaps}
						</ul>
					)}
				</div>
			</PanelContent>
		</>
	)
}
