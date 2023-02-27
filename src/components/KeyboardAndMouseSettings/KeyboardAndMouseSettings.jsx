// Module imports
import { useCallback } from 'react'
import { useStore } from 'statery'





// Module imports
import styles from './KeyboardAndMouseSettings.module.scss'

import {
	showRemappingModal,
	store,
} from './store.js'
import { KeyboardVisualiser } from '../KeyboardVisualiser/KeyboardVisualiser.jsx'
import { MappingTable } from '../MappingTable/MappingTable.jsx'
import { RemappingModal } from './RemappingModal/RemappingModal.jsx'





/**
 * Manage keyboard and mouse settings.
 */
export function KeyboardAndMouseSettings() {
	const {
		activeKeys,
		isRemappingModalVisible,
	} = useStore(store)

	const handleMappingClick = useCallback(options => showRemappingModal(options), [showRemappingModal])

	return (
		<>
			<div className={styles['wrapper']}>
				<div className={styles['mappings-wrapper']}>
					<MappingTable
						mode={'keyboard'}
						onMappingClick={handleMappingClick} />
				</div>

				<div className={styles['mappings-visualiser']}>
					<KeyboardVisualiser activeKeys={activeKeys} />
				</div>
			</div>

			{isRemappingModalVisible && (
				<RemappingModal />
			)}
		</>
	)
}
