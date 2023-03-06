// Module imports
import {
	useEffect,
	useMemo,
} from 'react'
import { useStore } from 'statery'





// Local imports
import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'
import { loadMap } from '../../../newStore/helpers/loadMap.js'
import { Meter } from '../../Meter/Meter.jsx'
import { store } from '../../../newStore/store.js'





/**
 * Renders the contents of the center panel for the Loading Map scene.
 */
export function CenterPanelContents() {
	const {
		contentManager,
		mapID,
		mapManager,
	} = useStore(store)

	const map = useMemo(() => {
		return contentManager.getMap(mapID)
	}, [
		contentManager,
		mapID,
	])

	useEffect(() => {
		loadMap()
	}, [])

	return (
		<div>
			<DecoratedHeader>{'Loading Map'}</DecoratedHeader>

			<dl>
				<dt>{'Map Name:'}</dt>
				<dd>{map.name}</dd>

				{Boolean(mapManager) && (
					<>
						<dt>{'Map Size:'}</dt>
						<dd>{`${mapManager.width} x ${mapManager.height}`}</dd>
					</>
				)}
			</dl>

			<Meter
				isFullWidth
				maximum={100}
				minimum={0}
				segmentSize={10}
				value={50} />
		</div>
	)
}
