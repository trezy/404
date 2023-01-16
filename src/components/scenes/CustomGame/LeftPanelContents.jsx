// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from '../../Button.jsx'
import { ButtonStack } from '../../ButtonStack/ButtonStack.jsx'
import { useStore } from '../../../store/react.js'





/**
 * Renders the contents of the left panel for the Custom Game scene.
 */
export function LeftPanelContents() {
  const goBack = useStore(state => state.goBack)

	const handleBackClick = useCallback(() => {
		goBack()
	}, [goBack])

	return (
		<ButtonStack className={'panel-bottom'}>
			<Button onClick={handleBackClick}>
				{'Back'}
			</Button>
		</ButtonStack>
	)
}
