// Module imports
import { useEffect } from 'react'





// Local imports
import { Meter } from '../../Meter.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the center panel for the Loading Map scene.
 */
export function CenterPanelContents() {
	const [
		loadMap,
		mapID,
		mapManager,
	] = useStore(state => [
		state.loadMap,
		state.mapID,
		state.mapManager,
	])

	useEffect(() => {
		loadMap()
	}, [
		loadMap,
	])

	return (
		<div>
			<header className={'panel-header'}>
				<h2>{'Loading Map'}</h2>
			</header>

			<dl>
				<dt>{'Map Name:'}</dt>
				<dd>{mapID}</dd>

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
