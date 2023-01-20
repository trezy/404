// Module imports
import classnames from 'classnames'
import { motion } from 'framer-motion'
import { useMemo } from 'react'





// Local imports
import styles from './Scene.module.scss'





export function Scene(props) {
	const {
		animate,
		children,
		className,
		exit,
		initial,
		variants,
	} = props

	const compiledClassName = useMemo(() => {
		return classnames(styles['scene'], className)
	}, [className])

	return (
		<motion.main
			animate={animate}
			className={compiledClassName}
			exit={exit}
			initial={initial}
			variants={variants}>
			{children}
		</motion.main>
	)
}
