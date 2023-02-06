// Module imports
import { useCallback } from 'react'




// Local imports
import styles from './StartPrompt.module.scss'

import {
	openMap,
	showLoadMapModal,
} from '../store.js'
import { Button } from '../../Button.jsx'





/**
 * Renders the map editor.
 */
export function StartPrompt() {
	const handleLoadMapClick = useCallback(() => showLoadMapModal(), [showLoadMapModal])

	const handleNewMapClick = useCallback(() => openMap(), [openMap])

	return (
		<div className={styles['wrapper']}>
			<div className={styles['start-prompt']}>
				<Button onClick={handleLoadMapClick}>
					{'Load a map'}
				</Button>

				<div className={styles['divider']}>{'or'}</div>

				<Button onClick={handleNewMapClick}>
					{'Start a new map'}
				</Button>
			</div>
		</div>
	)
}
