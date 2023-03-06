// Module imports
import { useMemo } from 'react'





// Local imports
import { convertMillisecondsToStopwatchString } from '../../../helpers/convertMillisecondsToStopwatchString'
import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'
import { MAP_SELECT } from '../../../constants/SceneNames.js'
import { pushScene } from '../../../newStore/helpers/pushScene.js'
import { SaveActions } from './SaveActions.jsx'
import { Table } from '../../Table/Table.jsx'
import { useStore } from '../../../store/react'





function handleLoad() {
	pushScene(MAP_SELECT)
}

/**
 * Renders the contents of the center panel for the Save Select scene.
 */
export function CenterPanelContents() {
	const saveManager = useStore(state => state.saveManager)

	const tableColumns = useMemo(() => {
		return [
			{
				key: 'name',
				label: 'Name',
			},
			{
				key: 'timePlayed',
				label: 'Time Played',
			},
			{
				key: 'updatedAt',
				label: 'Last Save',
			},
			{
				component: SaveActions,
				key: 'actions',
				onLoad: handleLoad,
			},
		]
	}, [])

	const tableData = useMemo(() => {
		const allSaves = saveManager.getAllSaves()

		return allSaves.map((save, index) => {
			const timestamp = new Date(save.updatedAt)
			const dateTimeFormatter = new Intl.DateTimeFormat([], {
				year: 'numeric', month: 'numeric', day: 'numeric',
				hour: 'numeric', minute: 'numeric', second: 'numeric',
			})

			return {
				id: save.id,
				name: save.name,
				timePlayed: convertMillisecondsToStopwatchString(save.getTimePlayed()),
				updatedAt: dateTimeFormatter.format(timestamp),
			}
		})
	}, [saveManager])

	return (
		<>
			<DecoratedHeader>{'Load Save'}</DecoratedHeader>

			<Table
				columns={tableColumns}
				data={tableData} />
		</>
	)
}
