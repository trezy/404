// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Combobox } from '../../../Combobox.jsx'
import { TILESET_IDS } from '../../../../data/TILE_IDS.js'





/**
 * Recursively converts an object of of tileset IDs into an options array.
 *
 * @param {Array} accumulator The options array.
 * @param {Array} pair A key/value pair.
 * @returns {Array} A compiled options array.
 */
function reduceTilesetIDs(accumulator, pair) {
	const [key, value] = pair
	// const foo = {
	// 	group: '',
	// 	label: '',
	// 	value: '',
	// }

	if (typeof value === 'string') {
		accumulator.push({
			group: (accumulator.group || []).join(':'),
			label: value,
			value: key,
		})
	} else {
		if (!accumulator.group) {
			accumulator.group = []
		}

		accumulator.group.push(key)

		Object
			.entries(value)
			.reduce(reduceTilesetIDs, accumulator)

		accumulator.group.pop()

		if (!accumulator.group.length) {
			delete accumulator.group
		}
	}

	return accumulator
}

/**
 * Renders a combobox containing all tileset IDs that are unused in the current asset pack.
 *
 * @param {object} props All props.
 */
export function TilesetIDCombobox(props) {
	const {
		onChange,
		value,
	} = props

	const handleChange = useCallback(newValue => {
		if (typeof onChange === 'function') {
			onChange(newValue)
		}
	}, [onChange])

	const options = useMemo(() => {
		const foo = Object
			.entries(TILESET_IDS)
			.reduce(reduceTilesetIDs, [])

		console.log(foo)

		return foo
	}, [])

	return (
		<Combobox
			onChange={handleChange}
			options={options}
			value={value} />
	)
}

TilesetIDCombobox.defaultProps = {
	onChange: null,
	value: null,
}

TilesetIDCombobox.propTypes = {
	onChange: PropTypes.func,
	value: PropTypes.any,
}
