// Module imports
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './EditorControls.module.scss'





export function EditorControls(props) {
	const { controls } = props

	const mappedControls = useMemo(() => {
		return controls.map(control => {
			return (
				<div className={styles['control']}>
					<label>{control.title}</label>

					{control.children}
				</div>
			)
		})
	}, [])

	return (
		<menu
			className={styles['editor-controls']}
			type={'toolbar'}>
			{mappedControls}
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
