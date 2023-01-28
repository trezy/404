// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from '../../Button.jsx'





export function SaveActions(props) {
	const {
		id,
		onLoad,
	} = props

	const handleLoadClick = useCallback(() => onLoad(id), [
		id,
		onLoad,
	])

	return (
		<Button
			isSmall
			onClick={handleLoadClick}>
			{'Load'}
		</Button>
	)
}
