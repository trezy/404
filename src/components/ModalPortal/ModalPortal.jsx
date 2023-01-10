// Local imports
import styles from './ModalPortal.module.scss'





/**
 * Renders the parent element into which all modals will be rendered.
 */
export function ModalPortal() {
	return (
		<div
			className={styles['modal-portal']}
			id={'modal-portal'} />
	)
}
