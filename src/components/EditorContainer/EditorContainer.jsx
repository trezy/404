// Local imports
import styles from './EditorContainer.module.scss'





export function EditorContainer(props) {
	return (
		<div className={styles['editor-container']}>
			{props.children}
		</div>
	)
}
