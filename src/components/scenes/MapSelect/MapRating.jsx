// Local imports
import styles from './MapRating.module.scss'

import { Meter } from '../../Meter/Meter.jsx'





export function MapRating(props) {
	const { rating } = props

	return (
		<div className={styles['wrapper']}>
			<Meter
				maximum={5}
				minimum={0}
				value={rating} />
		</div>
	)
}
