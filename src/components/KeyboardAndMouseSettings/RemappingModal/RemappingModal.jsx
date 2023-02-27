// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { useStore } from 'statery'





// Local imports
import styles from './RemappingModal.module.scss'

import {
	hideRemappingModal,
	store,
	updateControlBinding,
} from '../store.js'
import { Button } from '../../Button.jsx'
import { ControlsManager } from '../../../game/ControlsManager.js'
import { KeyboardKey } from '../../KeyboardKey/KeyboardKey.jsx'
import { Modal } from '../../Modal/Modal.jsx'
import { KeyboardMapping } from '../../KeyboardMapping/KeyboardMapping.jsx'
import { store as mainStore } from '../../../newStore/store.js'





export function RemappingModal() {
	const { bindingToRemap } = useStore(store)
	const { controls } = useStore(mainStore)

	const controlsManagerRef = useRef(null)

	if (!controlsManagerRef.current) {
		controlsManagerRef.current = new ControlsManager
	}

	const [activeKeys, setActiveKeys] = useState([])
	const [isCapturing, setIsCapturing] = useState(true)

	const currentBinding = useMemo(() => bindingToRemap[0].mappings[bindingToRemap[1]][bindingToRemap[2]], [bindingToRemap])

	const mappingConflict = useMemo(() => {
		if (!activeKeys.length) {
			return null
		}

		return controls.find(control => {
			if (control.mappings.keyboard.primary.length === activeKeys.length) {
				const isMatch = control.mappings.keyboard.primary.every(code => activeKeys.includes(code))

				if (isMatch) {
					return control
				}
			}

			if (control.mappings.keyboard.secondary.length === activeKeys.length) {
				const isMatch = control.mappings.keyboard.secondary.every(code => activeKeys.includes(code))

				if (isMatch) {
					return control
				}
			}

			return null
		})
	}, [
		activeKeys,
		controls,
	])

	const handleClose = useCallback(() => hideRemappingModal(), [])

	const handleKeyActivated = useCallback(keyState => {
		if (!isCapturing || /^(Escape|Meta(Left|Right))$/.test(keyState.code)) {
			return
		}

		setActiveKeys(previousState => {
			return [
				...previousState,
				keyState.code,
			]
		})
	}, [
		isCapturing,
		setActiveKeys,
	])

	const handleKeyDeactivated = useCallback(keyState => {
		if (!isCapturing) {
			return
		}

		if (/^(Escape|(Alt|Control|Meta|Shift)(Left|Right))$/.test(keyState.code)) {
			setActiveKeys(previousState => {
				return previousState.filter(item => item !== keyState.code)
			})
		} else {
			setIsCapturing(false)
		}
	}, [
		isCapturing,
		setIsCapturing,
		setActiveKeys,
	])

	const handleReset = useCallback(() => {
		setActiveKeys([])
		setIsCapturing(true)
	}, [
		setActiveKeys,
		setIsCapturing,
	])

	const handleSave = useCallback(() => {
		updateControlBinding(activeKeys)
		handleClose()
	}, [
		activeKeys,
		handleClose,
	])

	useEffect(() => {
		const controlsManager = controlsManagerRef.current
		const keyboard = controlsManager.getKeyboard()

		keyboard.on('key activated', handleKeyActivated)
		keyboard.on('key deactivated', handleKeyDeactivated)

		return () => {
			keyboard.off('key activated', handleKeyActivated)
			keyboard.off('key deactivated', handleKeyDeactivated)
		}
	}, [
		controlsManagerRef,
		handleKeyActivated,
		handleKeyDeactivated,
	])

	return (
		<Modal
			onClose={handleClose}
			title={'Update Keybind'}>
			<p className={styles['instructions']}>{'Press the key you want or '}<KeyboardKey code={'Escape'} isInline />{' to cancel.'}</p>

			<div className={styles['mappings']}>
				<div className={styles['current-mapping']}>
					<span>{'Current'}</span>

					<KeyboardMapping>
						{currentBinding.map(code => {
							return (
								<KeyboardKey
									key={code}
									code={code} />
							)
						})}
					</KeyboardMapping>
				</div>

				<div className={styles['new-mapping']}>
					<span>{'New'}</span>

					{!activeKeys.length && (
						<span className={styles['mapping-placeholder']}>{'Waiting for input...'}</span>
					)}

					{Boolean(activeKeys.length) && (
						<KeyboardMapping>
							{activeKeys.map(code => {
								return (
									<KeyboardKey
										key={code}
										code={code}
										isPressed />
								)
							})}
						</KeyboardMapping>
					)}
				</div>
			</div>

			{Boolean(!isCapturing && mappingConflict) && (
				<div className={styles['mapping-conflict']}>
					<span>
						<span className={styles['mapping-conflict-label']}>{'WARNING: '}</span>
						{'Saving will remove this binding from'}<br />
						{`"${mappingConflict.label}"`}
					</span>
				</div>
			)}

			<footer>
				<menu type={'toolbar'}>
					<div className={'menu-left'}>
						<Button onClick={handleClose}>
							{'Cancel'}
						</Button>
					</div>

					<div className={'menu-right'}>
						<Button
							isDisabled={isCapturing}
							onClick={handleReset}>
							{'Reset'}
						</Button>

						<Button
							isAffirmative
							isDisabled={isCapturing}
							onClick={handleSave}>
							{'Save'}
						</Button>
					</div>
				</menu>
			</footer>
		</Modal>
	)
}
