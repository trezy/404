// Local imports
import styles from './GameTitle.module.scss'





/**
 * Renders the game's title.
 */
export function GameTitle() {
	return (
		<h1 className={styles['game-title']}>
			<span>{'de'}</span>
			<span>{'bug'}</span>
		</h1>
	)
}
