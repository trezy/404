// Local imports
import { Panel } from './Panel.jsx'





export function TileQueuePanel() {
	return (
		<Panel
			className={'queue-panel'}
			title={'Queue'}>
			<ol className={'block-list layers-list'} />
		</Panel>
	)
}
