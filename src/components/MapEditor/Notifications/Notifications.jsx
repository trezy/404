// Module imports
import classnames from 'classnames'
import { useMemo } from 'react'
import { useStore } from 'statery'





// Local imports
import styles from './Notifications.module.scss'

import { store } from '../store.js'





export function Notifications() {
	const { notifications } = useStore(store)

	const mappedNotifications = useMemo(() => {
		return notifications.map(notification => {
			const compiledClassName = classnames(styles['notification'], {
				[styles['error']]: (notification.type === 'error'),
				[styles['success']]: (notification.type === 'success'),
			})

			return (
				<div
					key={notification.id}
					className={compiledClassName}>
					{notification.message}
				</div>
			)
		})
	}, [notifications])

	return (
		<div className={styles['notifications']}>
			{mappedNotifications}
		</div>
	)
}
