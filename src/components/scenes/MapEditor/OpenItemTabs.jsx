// Module imports
import classnames from 'classnames'
import { useCallback } from 'react'





// Local imports
import { useEditor } from './context/EditorContext.jsx'





export function OpenItemTabs() {
	const {
		closeItem,
		openItems,
		focusItem,
		focusedItemID,
	} = useEditor()

	const handleCloseItem = useCallback(({ target }) => closeItem(target.value), [closeItem])

	const handleFocusItem = useCallback(({ target }) => focusItem(target.value), [focusItem])

	const openItemValues = Object.values(openItems)

	return (
		<div className={'tabs'}>
			{Boolean(openItemValues.length) && (
				<ol>
					{openItemValues.map(openItemValue => {
						const {
							item,
							itemID,
						} = openItemValue

						return (
							<li
								key={itemID}
								className={classnames({
									active: focusedItemID === itemID,
									tab: true,
								})}>
								<button
									className={'focus-item'}
									onClick={handleFocusItem}
									type={'button'}
									value={itemID}>
									{item.name}
								</button>

								<button
									className={'close-item'}
									onClick={handleCloseItem}
									type={'button'}
									value={itemID}>
									&times;
								</button>
							</li>
						)
					})}
				</ol>
			)}
		</div>
	)
}
