// Module imports
import { motion } from 'framer-motion'





/**
 * Renders the game's title.
 */
export function GameTitle() {
	return (
		<motion.h1
			className={'game-title'}
			layoutId={'game-title'}>
			<span>{'de'}</span>
			<span>{'bug'}</span>
		</motion.h1>
	)
}
