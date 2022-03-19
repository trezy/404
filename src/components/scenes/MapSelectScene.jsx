// Module imports
import {
	useCallback,
	useMemo,
} from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonStack } from '../ButtonStack.jsx'
import { convertMillisecondsToStopwatchString } from '../../helpers/convertMillisecondsToStopwatchString.js'
import { Panel } from '../Panel.jsx'
import { PanelsLayout } from '../layouts/PanelsLayout.jsx'
import { Meter } from '../Meter.jsx'
import { Scene } from '../Scene.jsx'
import { useStore } from '../../store/react.js'





// Constants
const MAPS = [
	{
		bestTime: 60_000, // milliseconds
		id: 1,
		rating: 5,
		name: 'Level 1',
	},
	{
		bestTime: 120_000,
		id: 2,
		rating: 2.5,
		name: 'Level 2',
	},
	{
		bestTime: 123_456,
		id: 3,
		rating: 0.5,
		name: 'Level 3',
	},
	{
		bestTime: Math.ceil(Math.random() * 300_000),
		id: 4,
		rating: Number((Math.round(Math.random() * 50) * 0.1).toFixed(1)),
		name: 'Level 4',
	},
	{
		bestTime: Math.ceil(Math.random() * 300_000),
		id: 5,
		rating: Number((Math.round(Math.random() * 50) * 0.1).toFixed(1)),
		name: 'Level 5',
	},
]





export function MapSelectScene() {
	const [
		goToPlay,
		goToSettings,
		goToTitle,
	] = useStore(state => [
		state.goToPlay,
		state.goToSettings,
		state.goToTitle,
	])

	const loadMap = useCallback(mapID => () => goToPlay(mapID), [goToPlay])

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
	}, [MAPS])

	return (
		<Scene id="map-select">
			<PanelsLayout id="title">
				<Panel>
					<h2>{'Menu'}</h2>

					<ButtonStack className="panel-bottom">
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
