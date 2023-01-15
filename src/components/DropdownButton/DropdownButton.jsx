// Module imports
import {
	AnimatePresence,
	motion,
} from 'framer-motion'
import {
	Children,
	createElement,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import styles from './DropdownButton.module.scss'

import { Button } from '../Button.jsx'
import { useWindowEvent } from '../../hooks/useWindowEvent.js'





/**
 * A wrapper for groups of buttons.
 *
 * @param {object} props All component props.
 * @param {*} [props.children] Node to be rendered inside of the button.
 * @param {string} [props.className] A string of classes to be set on the button.
 */
export function DropdownButton(props) {
	const {
		children,
		className,
	} = props

	const itemsRef = useRef(null)
	const menuRef = useRef(null)

	const [isDropUp, setIsDropUp] = useState(false)

	const [isOpen, setIsOpen] = useState(false)

	const compiledClassName = useMemo(() => classnames(styles['wrapper'], className), [className])

	const compiledContainerClassName = useMemo(() => {
		return classnames(styles['expandable-container'], {
			[styles['is-drop-up']]: isDropUp,
		})
	}, [isDropUp])

	const compiledChildren = useMemo(() => {
		if (children === null) {
			return children
		}

		const result = {
			first: null,
			rest: [],
		}

		Children.forEach(children, (child, index) => {
			if (child === null) {
				return child
			}

			const newChild = createElement(child.type, {
				...child.props,
				key: child.key ?? index,
				ref: child.ref,
				variants: {
					...(child.props.variants || {}),
				},
			})

			if (!result.first) {
				result.first = newChild
			} else {
				result.rest.push(newChild)
			}
		})

		return result
	}, [children])

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
			className={compiledClassName}>
			<div className={compiledContainerClassName}>
				<div className={styles['expandable-control']}>
					{compiledChildren.first}

					<Button
						className={styles['chevron']}
						isAffirmative={!isOpen}
						isUniformlyPadded
						onClick={handleChevronClick} />
				</div>

				<AnimatePresence mode={'wait'}>
					{isOpen && (
						<motion.div
							key={'expandable-items'}
							ref={itemsRef}
							className={styles['expandable-items']}>
							{compiledChildren.rest}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.menu>
	)
}

DropdownButton.defaultProps = {
	children: null,
	className: '',
}

DropdownButton.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
}
