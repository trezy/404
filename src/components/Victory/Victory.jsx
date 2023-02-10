// Module imports
import { useStore } from 'statery'





// Local imports
import styles from './Victory.module.scss'

import { store } from '../../newStore/store.js'





export function Victory() {
	const {} = useStore(store)

	return (
		<div className={styles['wrapper']}>
			<div className={styles['content']}>
				<header className={styles['header']}>
					{'Victory!'}
				</header>

				<dl>
					<dt>{'Early Start'}</dt>
					<dd>{'1000'}</dd>

					<dt>{'Path Bonus'}</dt>
					<dd>{'1000'}</dd>

					<dt>{'Time Bonus'}</dt>
					<dd>{'1000'}</dd>

					<dt>{'Unused Tiles'}</dt>
					<dd>{'1000'}</dd>

					<dt>{'Blocking Tiles'}</dt>
					<dd>{'1000'}</dd>
				</dl>

				<div className={styles['total']}>
					<div>{'Total'}</div>
					<div>{'5000'}</div>
				</div>
			</div>
		</div>
	)
}
