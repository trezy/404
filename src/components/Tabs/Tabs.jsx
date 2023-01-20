// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import styles from './Tabs.module.scss'





/**
 * Renders a list of tabs (not their content).
 *
 * @param {object} props All props.
 * @param {string} props.activeTabID The ID of the tab that is currently active.
 * @param {string} props.className Additional classes to be applied to the component.
 * @param {Function} props.onClose A function to be triggered when the tab's close button is clicked.
 * @param {Function} props.onFocus A function to be triggered when the tab is clicked.
 * @param {boolean} props.showClose Whether or not close buttons should be visible.
 * @param {Array} props.tabs A list of items to be rendered as tab buttons.
 */
export function Tabs(props) {
	const {
		activeTabID,
		className,
		onClose,
		onFocus,
		showClose,
		tabs,
	} = props

	const handleCloseClick = useCallback(tab => () => {
		if (typeof onClose === 'function') {
			onClose(tab.id)
		}
	}, [onClose])

	const handleFocusClick = useCallback(tab => () => {
		if (typeof onFocus === 'function') {
			onFocus(tab.id)
		}
	}, [onFocus])

	const mappedTabs = useMemo(() => {
		return tabs.map(tab => {
			const {
				id,
				label,
			} = tab

			return (
				<li
					key={id}
					className={classnames(styles['tab'], {
						active: activeTabID === id,
					})}>
					<button
						className={styles['focus-item']}
						onClick={handleFocusClick(tab)}
						type={'button'}
						value={id}>
						{label}
					</button>

					{showClose && (
						<button
							className={styles['close-item']}
							onClick={handleCloseClick(tab)}
							type={'button'}
							value={id}>
							&times;
						</button>
					)}
				</li>
			)
		})
	}, [
		activeTabID,
		handleCloseClick,
		handleFocusClick,
		tabs,
	])

	const compiledClassName = useMemo(() => {
		return classnames(styles['tabs'], className)
	}, [className])

	return (
		<div className={compiledClassName}>
			<ol>{mappedTabs}</ol>
		</div>
	)
}

Tabs.defaultProps = {
	activeTabID: null,
	className: '',
	onClose: null,
	onFocus: null,
	showClose: false,
}

Tabs.propTypes = {
	activeTabID: PropTypes.any,
	className: PropTypes.string,
	onClose: PropTypes.func,
	onFocus: PropTypes.func,
	showClose: PropTypes.bool,
	tabs: PropTypes.array.isRequired,
}
