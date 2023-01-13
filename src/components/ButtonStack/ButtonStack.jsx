// Module imports
import {
	Children,
	createElement,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Local imports
import styles from './ButtonStack.module.scss'

import { Button } from '../Button.jsx'
import { useWindowEvent } from '../../hooks/useWindowEvent.js'





// Constants
const BUTTON_VARIANTS = {
	animate: {
		opacity: 1,
		x: 0,
		transition: {
			damping: 30,
			stiffness: 500,
			type: 'spring',
		},
	},
	exit: {
		opacity: 0,
		x: '-100%',
		transition: {
			duration: 0.2,
		},
	},
	initial: {
		opacity: 0,
		x: '-100%',
	},
}

const MENU_VARIANTS = {
	animate: {
		transition: {
			staggerChildren: 0.05,
		},
	},
	exit: {
		transition: {
			staggerChildren: 0.05,
		},
	},
	initial: {
		transition: {
			staggerChildren: 0.05,
		},
	},
}





/**
 * A wrapper for groups of buttons.
 *
 * @param {object} props All component props.
 * @param {*} [props.children] Node to be rendered inside of the button.
 * @param {string} [props.className] A string of classes to be set on the button.
 */
export function ButtonStack(props) {
	const {
		children,
		className,
		isCollapsed,
	} = props

	const itemsRef = useRef(null)
	const menuRef = useRef(null)

	const [isDropUp, setIsDropUp] = useState(false)

	const [isOpen, setIsOpen] = useState(false)

	const compiledClassName = useMemo(() => classnames(styles['button-stack'], className), [className])

	const compiledContainerClassName = useMemo(() => {
		return classnames(styles['expandable-container'], {
			[styles['is-drop-up']]: isDropUp,
		})
	}, [isDropUp])

	const compiledItemsClassName = useMemo(() => {
		return classnames(styles['expandable-items'], {
			[styles['is-open']]: isOpen,
		})
	}, [isOpen])

	const compiledChildren = useMemo(() => {
		if (children === null) {
			return children
		}

		let result = []

		if (isCollapsed) {
			result = {
				first: null,
				rest: [],
			}
		}

		Children.forEach(children, (child, index) => {
			if (child === null) {
				return child
			}

			const newChild = createElement(child.type, {
				...child.props,
				key: child.key ?? index,
				ref: child.ref,
				variants: BUTTON_VARIANTS,
			})

			if (isCollapsed) {
				if (!result.first) {
					result.first = newChild
				} else {
					result.rest.push(newChild)
				}
			} else {
				result.push(newChild)
			}
		})

		return result
	}, [
		children,
		isCollapsed,
	])

	const handleChevronClick = useCallback(() => {
		setIsOpen(previousState => !previousState)
	}, [setIsOpen])

	const updateDropUpState = useCallback(() => {
		const menuElement = menuRef.current
		const itemsElement = itemsRef.current

		if (!itemsElement || !menuElement) {
			return
		}

		const { height } = itemsElement.getBoundingClientRect()
		const { bottom } = menuElement.getBoundingClientRect()

		setIsDropUp(window.innerHeight < (bottom + height))
	}, [setIsDropUp])

	useWindowEvent({
		event: 'resize',
		invokeImmediately: true,
		handler: updateDropUpState,
	})

	return (
		<motion.menu
			ref={menuRef}
			animate={'animate'}
			className={compiledClassName}
			exit={'exit'}
			initial={'initial'}
			variants={MENU_VARIANTS}>
			{isCollapsed && (
				<div className={compiledContainerClassName}>
					<div className={styles['expandable-control']}>
						{compiledChildren.first}

						<Button
							className={styles['chevron']}
							isAffirmative={!isOpen}
							isUniformlyPadded
							onClick={handleChevronClick} />
					</div>

					<motion.div
						ref={itemsRef}
						className={compiledItemsClassName}
						animate={{
							opacity: isOpen ? 1 : 0,
						}}>
						{compiledChildren.rest}
					</motion.div>
				</div>
			)}

			{!isCollapsed && compiledChildren}
		</motion.menu>
	)
}

ButtonStack.defaultProps = {
	children: null,
	className: '',
	isCollapsed: false,
}

ButtonStack.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	isCollapsed: PropTypes.bool,
}
