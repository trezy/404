// Module imports
import PropTypes from 'prop-types'





export function PanelContainer(props) {
	const { panels } = props

	return (
		<div className={'panel-container'}>
			{panels.map((Panel, index) => (
				<Panel key={index} />
			))}
		</div>
	)
}

PanelContainer.propTypes = {
	panels: PropTypes.array.isRequired,
}
