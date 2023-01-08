// Module imports
import numeral from 'numeral'
import PropTypes from 'prop-types'





// Local imports
import styles from './Resourcepack.module.scss'





/**
 * Renders a resource pack.
 *
 * @param {*} props
 */
export function Resourcepack(props) {
	const { resourcepack } = props


	return (
		<div className={styles['resourcepack']}>
			{resourcepack.name}<br />
			{numeral(resourcepack.size).format('0.00 b')}
		</div>
	)
}

Resourcepack.propTypes = {
	resourcepack: PropTypes.object.isRequired,
}
