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
		currentMap,
		loadMap,
		map,
	] = useStore(state => [
		state.currentMap,
		state.loadMap,
		state.map,
	])

	useEffect(() => {
		loadMap()
	}, [
		loadMap,
	])

	return (
		<div>
			<h2>{'Loading Map'}</h2>

			<dl>
				<dt>{'Map Name:'}</dt>
				<dd>{currentMap}</dd>

				{Boolean(map) && (
					<>
						<dt>{'Map Size:'}</dt>
						<dd>{`${map.width} x ${map.height}`}</dd>
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
