// Module imports
import classnames from 'classnames'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useCallback } from 'react'





// Module imports
import { Button } from './Button.jsx'
import { useWindowEvent } from '../hooks/useWindowEvent.js'





export function Modal(props) {
	const {
		children,
		className,
		isLoading,
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
		<div className={classnames('modal', 'panel', className)}>
			<header>
				<div>
					<h2 className={'title'}>{title}</h2>

					{Boolean(onClose) && (
						<Button
							aria-label={'Close modal'}
							className={'close'}
							isNegative
							isUniformlyPadded
							onClick={handleClose} />
					)}
				</div>
			</header>

			<div className={'content'}>
				{children}

				{isLoading && (
					<div className={'loader'}>
						<span>{'Loading...'}</span>
					</div>
				)}
			</div>
		</div>
	), document.querySelector('#modal-portal'))
}

Modal.defaultProps = {
	className: '',
	isLoading: false,
	onClose: null,
}

Modal.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	isLoading: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string.isRequired,
}
