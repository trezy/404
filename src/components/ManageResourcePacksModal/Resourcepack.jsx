// Module imports
import numeral from 'numeral'
import PropTypes from 'prop-types'
import { useCallback } from 'react'





// Local imports
import styles from './Resourcepack.module.scss'

import { Checkbox } from '../Checkbox/Checkbox.jsx'





/**
 * Renders a resource pack.
 *
 * @param {*} props
 */
export function Resourcepack(props) {
	const {
		isSelected,
		onSelect,
		resourcepack,
	} = props

	const handleChange = useCallback(isChecked => {
		onSelect(resourcepack.id, isChecked)
	}, [
		onSelect,
		resourcepack,
	])

	const checkboxID = `checkbox::${resourcepack.id}`

	return (
		<label
			className={styles['resourcepack']}
			htmlFor={checkboxID}>
			<div className={styles['resourcepack-checkbox']}>
				<Checkbox
					id={checkboxID}
					isChecked={isSelected}
					onChange={handleChange} />
			</div>

			<div className={styles['resourcepack-details']}>
				{resourcepack.name}<br />
				{numeral(resourcepack.size).format('0.00 b')}
			</div>
		</label>
	)
}

Resourcepack.propTypes = {
	isSelected: PropTypes.bool.isRequired,
	onSelect: PropTypes.func.isRequired,
	resourcepack: PropTypes.object.isRequired,
}
