// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'





export function PanelsLayout(props) {
	const {
		children,
		id,
	} = props

	const className = classnames('layout', 'panels', props.className)

	return (
		<div
			className={className}
			id={id}>
			{children}
		</div>
	)
}

PanelsLayout.defaultProps = {
	children: null,
	className: '',
	id: '',
}

PanelsLayout.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	id: PropTypes.string,
}
