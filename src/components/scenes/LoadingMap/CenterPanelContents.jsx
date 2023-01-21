// Module imports
import {
	useEffect,
	useMemo,
} from 'react'





// Local imports
import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'
import { Meter } from '../../Meter.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Loading Map scene.
 */
export function CenterPanelContents() {
	const {
		contentManager,
		loadMap,
		mapID,
		mapManager,
	} = useStore(state => {
		return {
			contentManager: state.contentManager,
			loadMap: state.loadMap,
			mapID: state.mapID,
			mapManager: state.mapManager,
		}
	})

	const map = useMemo(() => {
		return contentManager.getMap(mapID)
	}, [contentManager])

	useEffect(() => {
		loadMap()
	}, [loadMap])

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
