// Module imports
import {
	useCallback,
	useMemo,
} from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { convertMillisecondsToStopwatchString } from '../../../helpers/convertMillisecondsToStopwatchString'
import { useStore } from '../../../store/react'





/**
 * Renders the contents of the center panel for the Save Select scene.
 */
export function CenterPanelContents() {
	const [
		goToMapSelect,
		saveManager,
	] = useStore(state => [
		state.goToMapSelect,
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
		<>
			<header className={'panel-header'}>
				<h2>{'Load Save'}</h2>
			</header>

			<table>
				<tbody>{mappedMaps}</tbody>
			</table>
		</>
	)
}
