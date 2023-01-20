// Module imports
import { motion } from 'framer-motion'





// Local imports
import styles from './EditorWrapper.module.scss'

import { EditorContextProvider } from '../Editor/Context/EditorContextProvider.jsx'
import { KeyStateContextProvider } from '../KeyStateContext/KeyStateContext.jsx'





// Constants
const VARIANTS = {
	animate: {
		opacity: 1,
	},

	exit: {
		opacity: 0,
	},

	initial: {
		opacity: 0,
	},
}





/**
 * Renders the map editor.
 */
export function EditorWrapper(props) {
	const { children } = props

	return (
		<motion.main
			animate={'animate'}
			className={styles['editor-wrapper']}
			exit={'exit'}
			initial={'initial'}
			variants={VARIANTS}>
			<EditorContextProvider>
				<KeyStateContextProvider>
					{children}
				</KeyStateContextProvider>
			</EditorContextProvider>
		</motion.main>
	)
}
