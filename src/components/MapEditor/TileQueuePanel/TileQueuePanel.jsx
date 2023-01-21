// Local imports
import { CollapsiblePanel } from '../../CollapsiblePanel/CollapsiblePanel.jsx'





export function TileQueuePanel() {
	return (
		<CollapsiblePanel
			className={'queue-panel'}
			title={'Queue'}>
			<ol className={'block-list'} />
		</CollapsiblePanel>
	)
}
