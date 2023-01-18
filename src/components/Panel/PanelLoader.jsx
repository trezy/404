// Module imports
import {
	AnimatePresence,
	motion,
} from 'framer-motion'





// Local imports
import styles from './PanelLoader.module.scss'

import { usePanelContext } from './Context/usePanelContext.js'





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
 * Renders a loader for panels.
 *
 * @component
 */
export function PanelLoader() {
	const { isLoading } = usePanelContext()

	return (
		<AnimatePresence mode={'wait'}>
			{isLoading && (
				<motion.div
					animate={'animate'}
					className={styles['loader']}
					exit={'exit'}
					initial={'initial'}
					variants={VARIANTS} />
			)}
		</AnimatePresence>
	)
}
