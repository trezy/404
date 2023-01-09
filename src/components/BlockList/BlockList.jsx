// Module imports
import PropTypes from 'prop-types'





// Local imports
import styles from './BlockList.module.scss'





/**
 * Renders a list of blocks.
 */
export function BlockList(props) {
	const { children } = props

	return (
		<ol className={styles['block-list']}>
			{children}
		</ol>
	)
}

BlockList.defaultProps = {
	children: null,
}

BlockList.propTypes = {
	children: PropTypes.node,
}
