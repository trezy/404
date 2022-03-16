// Module imports
import { useMemo } from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonStack } from '../ButtonStack.jsx'
import { convertMillisecondsToStopwatchString } from '../../helpers/convertMillisecondsToStopwatchString.js'
import { Panel } from '../Panel.jsx'
import { PanelsLayout } from '../layouts/PanelsLayout.jsx'
import { Scene } from '../Scene.jsx'
import { useStore } from '../../store/react.js'





// Constants
const LEVELS = [
	{
		bestTime: 60_000, // milliseconds
		rating: 5,
		name: 'Level 1',
	},
	{
		bestTime: 120_000,
		rating: 2.5,
		name: 'Level 2',
	},
	{
		bestTime: 123_456,
		rating: Math.round(Math.random() * 5),
		name: 'Level 3',
	},
	{
		bestTime: Math.ceil(Math.random() * 300_000),
		rating: Math.round(Math.random() * 5),
		name: 'Level 4',
	},
	{
		bestTime: Math.ceil(Math.random() * 300_000),
		rating: Math.round(Math.random() * 5),
		name: 'Level 5',
	},
]





export function MapSelectScene() {
	const [
		goToSettings,
		goToTitle,
	] = useStore(state => [
		state.goToSettings,
		state.goToTitle,
	])

	const mappedLevels = useMemo(() => {
		return LEVELS.map(level => {
			return (
				<tr>
					<th>{level.name}</th>

					<td>{convertMillisecondsToStopwatchString(level.bestTime)}</td>

					<td>{level.rating}</td>

					<td>
						<Button isSmall>
							{'Play'}
						</Button>
					</td>
				</tr>
			)
		})
	}, [LEVELS])

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
							{mappedLevels}
						</tbody>
					</table>
				</Panel>
			</PanelsLayout>
		</Scene>
	)
}
