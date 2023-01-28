// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from '../../Button.jsx'





export function MapActions(props) {
	const {
		id,
		onSelect,
	} = props

	const handleSelectClick = useCallback(() => onSelect(id), [
		id,
		onSelect,
	])

	return (
		<Button onClick={handleSelectClick}>
			{'Select'}
		</Button>
	)
}
