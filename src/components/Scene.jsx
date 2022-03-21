// Module imports
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





/**
 * A wrapper for individual scenes.
 *
 * @param {object} props All component props.
 * @param {*} [props.children] Node to be rendered inside of the scene.
 * @param {string} props.id An unique identifier for the scene.
 */
export function Scene(props) {
	const {
		children,
		id,
	} = props

	return (
		<motion.main
			key={id}
			className={'scene'}
			id={id}>
			{children}
		</motion.main>
	)
}

Scene.defaultProps = {
	children: null,
}

Scene.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
}
