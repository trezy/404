// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import styles from './CollapsiblePanel.module.scss'

import { Panel } from '../Panel/Panel.jsx'
import { PanelContent } from '../Panel/PanelContent.jsx'
import { PanelMenu } from '../Panel/PanelMenu.jsx'





/**
 * Renders an editor panel.
 *
 * @param {object} props All props.
 * @param {import('react').ReactNode} [props.children] Node to be rendered inside of the component.
 * @param {string} [props.className] A string of classes to be set on the button.
 * @param {boolean} [props.defaultIsOpen=true] Whether or not the panel is open by default.
 * @param {string} [props.menu] A component to be rendered inside the footer menu of the panel.
 * @param {object} props.title The title to be displayed at the top of the panel.
 */
export function CollapsiblePanel(props) {
	const {
		children,
		className,
		defaultIsOpen,
		menu,
		title,
	} = props
	const [isOpen, setIsOpen] = useState(defaultIsOpen)

	const handleHeaderClick = useCallback(() => setIsOpen(previousState => !previousState), [setIsOpen])

	const handleHeaderKeyUp = useCallback(event => {
		if (['enter', ' '].includes(event.key.toLowerCase())) {
			setIsOpen(previousState => !previousState)
		}
	}, [setIsOpen])

	const compiledClassName = useMemo(() => {
		return classnames(className, styles['is-collapsible'], {
			[styles['is-open']]: isOpen,
		})
	}, [
		className,
		isOpen,
	])

	return (
		<Panel className={compiledClassName}>
			<header
				onClick={handleHeaderClick}
				onKeyUp={handleHeaderKeyUp}
				role={'button'}
				tabIndex={0}>
				<h2>{title}</h2>
			</header>

			<PanelContent
				className={styles['panel-content']}
				hidden={!isOpen}>
				{children}
			</PanelContent>

			{Boolean(menu) && (
				<PanelMenu>
					<menu
						hidden={!isOpen}
						type={'toolbar'}>
						{menu}
					</menu>
				</PanelMenu>
			)}
		</Panel>
	)
}

CollapsiblePanel.defaultProps = {
	children: null,
	className: '',
	defaultIsOpen: true,
	menu: null,
}

CollapsiblePanel.propTypes = {
	children: PropTypes.node,
	className: PropTypes.node,
	defaultIsOpen: PropTypes.bool,
	menu: PropTypes.node,
	title: PropTypes.node.isRequired,
}
