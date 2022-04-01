// Module imports
import {
	useCallback,
	useMemo,
} from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { convertMillisecondsToStopwatchString } from '../../../helpers/convertMillisecondsToStopwatchString.js'
import { Meter } from '../../Meter.jsx'
import { useStore } from '../../../store/react.js'





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





/**
 * Renders the contents of the center panel for the Map Select scene.
 */
export function CenterPanelContents() {
	const [goToLoadingMap] = useStore(state => [state.goToLoadingMap])

	const loadMap = useCallback(mapID => () => goToLoadingMap(mapID), [goToLoadingMap])

	const mappedMaps = useMemo(() => {
		return MAPS.map((map, index) => {
			return (
				<tr key={index}>
					<th>{map.name}</th>

					<td>{convertMillisecondsToStopwatchString(map.bestTime)}</td>

					<td>
						<Meter
							maximum={5}
							minimum={0}
							value={map.rating} />
					</td>

					<td>
						<Button
							isSmall
							onClick={loadMap(map.id)}>
							{'Load'}
						</Button>
					</td>
				</tr>
			)
		})
	}, [loadMap])

	return (
		<>
			<h2>{'Map Select'}</h2>

			<table>
				<tbody>
					{mappedMaps}
				</tbody>
			</table>
		</>
	)
}
