// Module imports
import { useMemo } from 'react'





// Local imports
import { convertMillisecondsToStopwatchString } from '../../../helpers/convertMillisecondsToStopwatchString.js'
import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'
import { LOADING_MAP } from '../../../constants/SceneNames.js'
import { MapActions } from './MapActions.jsx'
import { MapRating } from './MapRating.jsx'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { selectMap } from '../../../newStore/helpers/selectMap.js'
import { Table } from '../../Table/Table.jsx'





// Constants
const MAPS = [
	{
		bestTime: 60_000, // milliseconds
		id: 'test',
		rating: 5,
		name: 'Level 1',
	},
	{
		bestTime: 120_000,
		id: 'test',
		rating: 2.5,
		name: 'Level 2',
	},
	{
		bestTime: 123_456,
		id: 'test',
		rating: 0.5,
		name: 'Level 3',
	},
	{
		bestTime: Math.ceil(Math.random() * 300_000),
		id: 'test',
		rating: Number((Math.round(Math.random() * 50) * 0.1).toFixed(1)),
		name: 'Level 4',
	},
	{
		bestTime: Math.ceil(Math.random() * 300_000),
		id: 'test',
		rating: Number((Math.round(Math.random() * 50) * 0.1).toFixed(1)),
		name: 'Level 5',
	},
]





function handleLoad(mapID) {
	return () => {
		selectMap(mapID)
		pushScene(LOADING_MAP)
	}
}

/**
 * Renders the contents of the center panel for the Map Select scene.
 */
export function CenterPanelContents() {
	const tableColumns = useMemo(() => {
		return [
			{
				key: 'name',
				label: 'Name',
			},
			{
				key: 'bestTime',
				label: 'Best Time',
			},
			{
				component: MapRating,
				key: 'rating',
				label: 'Rating',
			},
			{
				component: MapActions,
				key: 'actions',
				onLoad: handleLoad,
			},
		]
	}, [])

	const tableData = useMemo(() => {
		return MAPS.map(map => {
			return {
				bestTime: convertMillisecondsToStopwatchString(map.bestTime),
				id: map.id,
				name: map.name,
				rating: map.rating,
			}
		})
	}, [])

	return (
		<>
			<DecoratedHeader>{'Map Select'}</DecoratedHeader>

			<Table
				columns={tableColumns}
				data={tableData} />
		</>
	)
}
