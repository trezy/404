// Module imports
import classnames from 'classnames'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useCallback } from 'react'





// Module imports
import styles from './Modal.module.scss'

import { Button } from '../Button.jsx'
import { Panel } from '../Panel/Panel.jsx'
import { useWindowEvent } from '../../hooks/useWindowEvent.js'





/**
 * Renders a modal.
 */
export function Modal(props) {
	const {
		children,
		className,
		isLoading,
		loaderText,
		onClose,
		title,
	} = props

	const handleClose = useCallback(() => {
		if (typeof onClose === 'function') {
			onClose()
		}
	}, [onClose])

	const handleKeyUp = useCallback(event => {
		if (event.key.toLowerCase() === 'escape') {
			event.preventDefault()
			handleClose()
		}
	}, [handleClose])

	useWindowEvent({
		event: 'keyup',
		handler: handleKeyUp,
	})

	if (typeof window === 'undefined') {
		return null
	}

	return createPortal((
		<Panel className={classnames(styles['modal'], className)}>
			<header>
				<h2 className={styles['title']}>{title}</h2>

				{Boolean(onClose) && (
					<Button
						aria-label={'Close modal'}
						className={styles['close']}
						isNegative
						isUniformlyPadded
						onClick={handleClose} />
				)}
			</header>

			<div className={styles['content']}>
				{children}
			</div>

			{isLoading && (
				<div className={styles['loader']}>
					<span>{loaderText}</span>
				</div>
			)}
		</Panel>
	), document.querySelector('#modal-portal'))
}

Modal.defaultProps = {
	children: null,
	className: '',
	isLoading: false,
	loaderText: 'Loading...',
	onClose: null,
}

Modal.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	isLoading: PropTypes.bool,
	loaderText: PropTypes.string,
	onClose: PropTypes.func,
	title: PropTypes.string.isRequired,
}
