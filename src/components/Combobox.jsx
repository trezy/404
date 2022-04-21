// Module imports
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Constants
const CLOSE_KEYS = ['ArrowUp', 'Escape']
const OPEN_KEYS = ['ArrowDown', 'ArrowUp']





/**
 * Determines whether or not an element is currently visible within the viewport.
 *
 * @param {*} element The element to check for visibility.
 * @returns {boolean} Whether or not the element is visible.
 */
function isElementInView(element) {
	const bounding = element.getBoundingClientRect()

	if (bounding.top < 0) {
		return false
	}

	if (bounding.left < 0) {
		return false
	}

	if (bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
		return false
	}

	if (bounding.right <= (window.innerWidth || document.documentElement.clientWidth)) {
		return false
	}

	return true
}





/**
 * An interactive component that displays a list of options when activated.
 *
 * @param {object} props All component props.
 * @param {string} [props.className] Classes to be applied to the rendered component.
 * @param {string} [props.emptyMessage] Text to be displayed when there are no options.
 * @param {boolean} [props.isDisabled] Whether or not the component is currently interactive.
 * @param {Function} [props.onChange] A function to be called when the selected option changes.
 * @param {Array} [props.options] A list of options to be displayed in the list.
 * @param {*} [props.value] Allows the current value of the combobox to be maintained externally.
 */
export function Combobox(props) {
	const {
		className,
		emptyMessage,
		isDisabled,
		onChange,
		options,
		value,
	} = props

	const [isOpen, setIsOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(options[0])
	const comboboxID = useId()

	const compiledClassName = useMemo(() => classnames('combobox', className), [className])

	const getOptionKey = useCallback(option => {
		return `${comboboxID}-options-${option.value}`
	}, [comboboxID])

	const selectOption = useCallback(option => {
		onChange(option)

		if (value) {
			return
		}

		setSelectedOption(option)

		const optionKey = getOptionKey(option)
		const element = document.querySelector(`[id="${optionKey}"]`)

		if (!isElementInView(element)) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}
	}, [
		getOptionKey,
		onChange,
		setSelectedOption,
		value,
	])

	const hideOptions = useCallback(() => setIsOpen(false), [setIsOpen])
	const showOptions = useCallback(() => setIsOpen(true), [setIsOpen])

	const handleOptionInteraction = useCallback(option => event => {
		const {
			key,
			type,
		} = event

		if (type === 'click') {
			selectOption(option)
			hideOptions()
		} else if (type === 'keyup') {
			if (CLOSE_KEYS.includes(key)) {
				if (key !== 'Escape') {
					selectOption(option)
				}

				hideOptions()
			}
		}
	}, [
		hideOptions,
		selectOption,
	])

	const mappedOptions = useMemo(() => {
		const optionGroups = options.reduce((accumulator, option) => {
			if (option.group && !accumulator[option.group]) {
				accumulator[option.group] = []
			}

			const id = getOptionKey(option)
			const isSelected = selectedOption === option

			accumulator[option.group || 'Other'].push((
				<div
					key={id}
					aria-selected={isSelected}
					id={id}
					role={'option'} >
					{/* eslint-disable-next-line react/forbid-elements */}
					<button
						onClick={handleOptionInteraction(option)}
						onKeyUp={handleOptionInteraction(option)}
						type={'button'}>
						{option.label ?? option.value}
					</button>
				</div>
			))

			return accumulator
		}, {
			Other: [],
		})

		const optionGroupEntries = Object.entries(optionGroups)

		if (optionGroupEntries.length === 1) {
			return optionGroups.Other
		}

		return optionGroupEntries.map(([optionGroupName, items]) => {
			if (!items.length) {
				return null
			}

			return (
				<div
					key={optionGroupName}
					className={'combobox-options-group'}>
					<header>{optionGroupName}</header>
					{items}
				</div>
			)
		})
	}, [
		getOptionKey,
		handleOptionInteraction,
		options,
		selectedOption,
	])

	const handleLabelInteraction = useCallback(event => {
		const {
			key,
			type,
		} = event

		if (isDisabled) {
			return
		}

		if (type === 'click') {
			if (isOpen) {
				hideOptions()
			} else if (!isOpen) {
				showOptions()
			}
		} else if (type === 'keyup') {
			if (isOpen && CLOSE_KEYS.includes(key)) {
				hideOptions()
			} else if (!isOpen && OPEN_KEYS.includes(key)) {
				showOptions()
			}
		}
	}, [
		isDisabled,
		hideOptions,
		isOpen,
		showOptions,
	])

	useEffect(() => {
		if (isDisabled) {
			setIsOpen(false)
		}
	}, [isDisabled])

	useEffect(() => {
		if (value && (value !== selectedOption)) {
			setSelectedOption(value)

			const optionKey = getOptionKey(value)
			const element = document.querySelector(`[id="${optionKey}"]`)

			if (!isElementInView(element)) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
				})
			}
		}
	}, [
		getOptionKey,
		selectedOption,
		setSelectedOption,
		value,
	])

	return (
		<div className={compiledClassName}>
			<label
				aria-activedescendant={selectedOption ? getOptionKey(selectedOption) : null}
				className={'combobox-label'}
				id={`${comboboxID}-label`}
				// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={0}>
				{/* eslint-disable-next-line react/forbid-elements */}
				<button
					onClick={handleLabelInteraction}
					onKeyUp={handleLabelInteraction}
					type={'button'}>
					{selectedOption?.label ?? selectedOption?.value ?? emptyMessage}
				</button>
			</label>

			<div
				aria-labelledby={`${comboboxID}-label`}
				className={'combobox-options'}
				hidden={!isOpen}
				role={'listbox'}
				tabIndex={-1}>
				{mappedOptions}
			</div>
		</div>
	)
}

Combobox.defaultProps = {
	className: '',
	emptyMessage: 'No options available.',
	isDisabled: false,
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	onChange: () => {},
	options: [],
	value: null,
}

Combobox.propTypes = {
	className: PropTypes.string,
	emptyMessage: PropTypes.string,
	isDisabled: PropTypes.bool,
	onChange: PropTypes.func,
	options: PropTypes.array,
	value: PropTypes.any,
}
