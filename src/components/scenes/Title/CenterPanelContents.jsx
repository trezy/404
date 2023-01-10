// Local imports
import styles from './CenterPanelContents.module.scss'

import { GameTitle } from '../../GameTitle/GameTitle.jsx'





/**
 * Renders the contents of the center panel for the Title scene.
 */
export function CenterPanelContents() {
	return (
		<div className={styles['game-title-wrapper']}>
			<GameTitle />
		</div>
	)
}
