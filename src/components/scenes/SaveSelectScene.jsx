// Module imports
import {
	useCallback,
	useMemo,
} from 'react'





// Local imports
import { Button } from '../Button'
import { ButtonStack } from '../ButtonStack'
import { convertMillisecondsToStopwatchString } from '../../helpers/convertMillisecondsToStopwatchString'
import { Panel } from '../Panel'
import { PanelsLayout } from '../layouts/PanelsLayout'
import { Scene } from '../Scene'
import { useStore } from '../../store/react'

/**
 *
 */
export function SaveSelectScene() {
	const [
		goToMapSelect,
		goToSettings,
		goToTitle,
		saveManager,
	] = useStore(state => [
		state.goToMapSelect,
		state.goToSettings,
		state.goToTitle,
		state.saveManager,
	])

	const handleLoadClick = useCallback(saveID => () => {
		goToMapSelect(saveID)
	}, [goToMapSelect])

	const mappedMaps = useMemo(() => {
		const allSaves = saveManager.getAllSaves()

		return allSaves.map((save, index) => {
			const timestamp = new Date(save.updatedAt)
			const dateTimeFormatter = new Intl.DateTimeFormat([], {
				year: 'numeric', month: 'numeric', day: 'numeric',
				hour: 'numeric', minute: 'numeric', second: 'numeric',
			})
			const formattedDateTime = dateTimeFormatter.format(timestamp)

			const timePlayedString = convertMillisecondsToStopwatchString(save.getTimePlayed())

			return (
				<tr key={index}>
					<th>{save.name}</th>
					<td>{timePlayedString}</td>
					<td>{' | '}</td>
					<td>{formattedDateTime}</td>
					<td>
						<Button
							isSmall
							onClick={handleLoadClick(save.id)}>
							{'Load'}
						</Button>
					</td>
				</tr>
			)
		})
	}, [
		handleLoadClick,
		saveManager,
	])

	return (
		<Scene id={'map-select'}>
			<PanelsLayout id={'title'}>
				<Panel>
					<h2>{'Menu'}</h2>

					<ButtonStack className={'panel-bottom'}>
						<Button>{'Statistics'}</Button>

						<Button onClick={goToSettings}>{'Settings'}</Button>

						<Button onClick={goToTitle}>{'Main Menu'}</Button>
					</ButtonStack>
				</Panel>

				<Panel columnSpan={3}>
					<h2>{'Load Save'}</h2>

					<table>
						<tbody>{mappedMaps}</tbody>
					</table>
				</Panel>
			</PanelsLayout>
		</Scene>
	)
}
