// Module imports
import PropTypes from 'prop-types'





// Local imports
import styles from './EditorControls.module.scss'





function mapControls(control) {
	return (
		<div
			key={control.title}
			className={styles['control']}>
			<label>{control.title}</label>

			{control.children}
		</div>
	)
}

export function EditorControls(props) {
	const { controls } = props

	return (
		<menu
			className={styles['editor-controls']}
			type={'toolbar'}>
			{controls.map(mapControls)}
		</menu>
	)
}

EditorControls.defaultProps = {
	controls: [],
}

EditorControls.propTypes = {
	controls: PropTypes.arrayOf(PropTypes.shape({
		children: PropTypes.node.isRequired,
		title: PropTypes.string.isRequired,
	})),
}
