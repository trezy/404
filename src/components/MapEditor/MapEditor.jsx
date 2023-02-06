// Module imports
import {
	useMemo,
	useRef,
} from 'react'
import classnames from 'classnames'
import { useStore } from 'statery'




// Local imports
import styles from './MapEditor.module.scss'

import { LeftPanelContainer } from './LeftPanelContainer/LeftPanelContainer.jsx'
import { MapEditorControls } from './MapEditorControls/MapEditorControls.jsx'
import { Modals } from './Modals.jsx'
import { Notifications } from './Notifications/Notifications.jsx'
import { OpenItemTabs } from './OpenItemTabs.jsx'
import { StartPrompt } from './StartPrompt/StartPrompt.jsx'
import { store } from './store.js'
import { useMapEditor } from './useMapEditor.js'





/**
 * Renders the map editor.
 */
export function MapEditor() {
	const canvasRef = useRef(null)

	const {
		activeTabID,
		isLoadingMap,
	} = useStore(store)

	const compiledCanvasWrapperClassName = useMemo(() => {
		return classnames(styles['canvas-wrapper'], {
			[styles['is-loading']]: isLoadingMap,
		})
	}, [isLoadingMap])

	useMapEditor({
		canvasRef,
		dependencies: [activeTabID],
	})

	return (
		<>
			<div className={styles['map-editor']}>
				<LeftPanelContainer className={styles['left-panel']} />

				{(isLoadingMap || Boolean(activeTabID)) && (
					<>
						<OpenItemTabs />

						<div className={compiledCanvasWrapperClassName}>
							<canvas
								ref={canvasRef}
								className={styles['canvas']}
								draggable />

							<Notifications />
						</div>

						<MapEditorControls />
					</>
				)}

				{(!isLoadingMap && !activeTabID) && (
					<StartPrompt />
				)}
			</div>

			<Modals />
		</>
	)
}
