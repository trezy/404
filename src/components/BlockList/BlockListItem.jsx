// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './BlockListItem.module.scss'





/**
 * Renders a closk list item.
 */
export function BlockListItem(props) {
	const {
		children,
		hasThumbnail,
		isCentered,
		isEmpty,
	} = props

	const compiledClassName = useMemo(() => {
		return classnames(styles['block-list-item'], {
			[styles['has-thumbnail']]: hasThumbnail,
			[styles['is-centered']]: isEmpty || isCentered,
			[styles['is-empty']]: isEmpty,
		})
	}, [
		hasThumbnail,
		isCentered,
		isEmpty,
	])

	return (
		<li className={compiledClassName}>
			{children}
		</li>
	)
}

BlockListItem.defaultProps = {
	children: null,
	hasThumbnail: false,
	isCentered: false,
	isEmpty: false,
}

BlockListItem.propTypes = {
	children: PropTypes.node,
	hasThumbnail: PropTypes.bool,
	isCentered: PropTypes.bool,
	isEmpty: PropTypes.bool,
}
