// Local imports
import { Panel } from './Panel.jsx'





export function TilesPanel() {
	return (
		<Panel
			className={'tiles-panel'}
			title={'Tiles'}>
			<ol className={'block-list layers-list'} />
		</Panel>
	)
}
