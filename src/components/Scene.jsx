// Module imports
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





export function Scene(props) {
	const {
		children,
		id,
	} = props

	return (
		<motion.main
			key={id}
			className="scene"
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
