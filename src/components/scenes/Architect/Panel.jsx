// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





/**
 * Renders an editor panel.
 *
 * @param {object} props All props.
 * @param {import('react').ReactNode} [props.children] Node to be rendered inside of the component.
 * @param {string} [props.className] A string of classes to be set on the button.
 * @param {boolean} [props.defaultIsOpen=true] Whether or not the panel is open by default.
 * @param {boolean} [props.isCollapsible=false] Whether or not the panel is collapsible.
 * @param {string} [props.menu] A component to be rendered inside the footer menu of the panel.
 * @param {object} props.title The title to be displayed at the top of the panel.
 */
export function Panel(props) {
	const {
		children,
		className,
		defaultIsOpen,
		isCollapsible,
		isScrollable,
		menu,
		title,
	} = props
	const [isOpen, setIsOpen] = useState((() => {
		if (isCollapsible) {
			return defaultIsOpen
		}

		return true
	})())

	const handleHeaderClick = useCallback(() => {
		if (isCollapsible) {
			setIsOpen(previousState => !previousState)
		}
	}, [
		isCollapsible,
		setIsOpen,
	])

	const handleHeaderKeyUp = useCallback(event => {
		if (isCollapsible && ['enter', ' '].includes(event.key.toLowerCase())) {
			setIsOpen(previousState => !previousState)
		}
	}, [
		isCollapsible,
		setIsOpen,
	])

	const containerProps = useMemo(() => {
		const result = {
			className: classnames('panel', className, {
				'is-collapsible': isCollapsible,
				'is-scrollable': isScrollable,
			}),
		}

		if (isCollapsible) {
			result['data-open'] = isOpen
		}

		return result
	}, [
		className,
		isCollapsible,
		isOpen,
		isScrollable,
	])

	const headerProps = useMemo(() => {
		if (isCollapsible) {
			return {
				onClick: handleHeaderClick,
				onKeyUp: handleHeaderKeyUp,
				role: 'button',
				tabIndex: 0,
			}
		}

		return {}
	}, [
		handleHeaderClick,
		handleHeaderKeyUp,
		isCollapsible,
	])

	return (
		<div {...containerProps}>
			<header {...headerProps}>
				<h2>{title}</h2>
			</header>

			<div
				className={'panel-content'}
				hidden={!isOpen}>
				<div className={'panel-scroller'}>
					{children}
				</div>
			</div>

			{Boolean(menu) && (
				<menu
					hidden={!isOpen}
					type={'toolbar'}>
					{menu}
				</menu>
			)}
		</div>
	)
}

Panel.defaultProps = {
	children: null,
	className: '',
	defaultIsOpen: true,
	isCollapsible: false,
	isScrollable: true,
	menu: null,
}

Panel.propTypes = {
	children: PropTypes.node,
	className: PropTypes.node,
	defaultIsOpen: PropTypes.bool,
	isCollapsible: PropTypes.bool,
	isScrollable: PropTypes.bool,
	menu: PropTypes.node,
	title: PropTypes.node.isRequired,
}
