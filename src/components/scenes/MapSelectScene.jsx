// Module imports
import {
	useCallback,
	useMemo,
} from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonStack } from '../ButtonStack.jsx'
import { convertMillisecondsToStopwatchString } from '../../helpers/convertMillisecondsToStopwatchString.js'
import { Meter } from '../Meter.jsx'
import { Panel } from '../Panel.jsx'
import { PanelsLayout } from '../layouts/PanelsLayout.jsx'
import { Scene } from '../Scene.jsx'
import { useStore } from '../../store/react.js'





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
 * Scene component for selecting a map to load.
 */
export function MapSelectScene() {
	const [
		goToLoadingMap,
		goToSettings,
		goToTitle,
	] = useStore(state => [
		state.goToLoadingMap,
		state.goToSettings,
		state.goToTitle,
	])

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
							{'Play'}
						</Button>
					</td>
				</tr>
			)
		})
	}, [loadMap])

	return (
		<Scene id={'map-select'}>
			<PanelsLayout id={'title'}>
				<Panel>
					<h2>{'Menu'}</h2>

					<ButtonStack className={'panel-bottom'}>
						<Button>
							{'Statistics'}
						</Button>

						<Button onClick={goToSettings}>
							{'Settings'}
						</Button>

						<Button onClick={goToTitle}>
							{'Main Menu'}
						</Button>
					</ButtonStack>
				</Panel>

				<Panel columnSpan={3}>
					<h2>{'Map Select'}</h2>

					<table>
						<tbody>
							{mappedMaps}
						</tbody>
					</table>
				</Panel>
			</PanelsLayout>
		</Scene>
	)
}
