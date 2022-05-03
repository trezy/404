// Module imports
import {
	useCallback,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





export function Panel(props) {
	const {
		children,
		className,
		defaultIsOpen,
		menu,
		title,
	} = props
	const [isOpen, setIsOpen] = useState(defaultIsOpen)

	const handleHeaderClick = useCallback(() => {
		setIsOpen(previousState => !previousState)
	}, [setIsOpen])

	const handleHeaderKeyUp = useCallback(event => {
		if (['enter', ' '].includes(event.key.toLowerCase())) {
			setIsOpen(previousState => !previousState)
		}
	}, [setIsOpen])

	return (
		<div
			className={classnames('panel', className)}
			data-open={isOpen}>
			{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
			<header
				onClick={handleHeaderClick}
				onKeyUp={handleHeaderKeyUp}
				role={'button'}
				// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={0}>
				<h2>{title}</h2>
			</header>

			<div
				className={'panel-content'}
				hidden={!isOpen}>
				<div className={'panel-scroller'}>
					{children}
				</div>

				{Boolean(menu) && (
					<menu
						hidden={!isOpen}
						type={'toolbar'}>
						{menu}
					</menu>
				)}
			</div>
		</div>
	)
}

Panel.defaultProps = {
	className: '',
	defaultIsOpen: true,
	menu: null,
}

Panel.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.node,
	defaultIsOpen: PropTypes.bool,
	menu: PropTypes.node,
	title: PropTypes.node.isRequired,
}
