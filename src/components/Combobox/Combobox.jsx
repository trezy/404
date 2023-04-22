// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useId as useID,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { ComboboxContainer } from './ComboboxContainer.jsx'
import { isElementInView } from '../../helpers/isElementInView.js'
import { useNavGraphContext } from '../NavGraph/NavGraphContextProvider.jsx'





// Constants
const CLOSE_KEYS = ['ArrowUp', 'Escape']
const OPEN_KEYS = ['ArrowDown', 'ArrowUp']
const ComboboxContext = createContext({
	className: '',
	comboboxID: '',
	emptyMessage: '',
	id: '',
	isDisabled: false,
	isOpen: false,
	labelClassName: '',
	navGroupID: '',
	navGroupLinks: [],
	options: [],
	selectedOption: null,

	generateOptionKey: () => {},
	handleLabelActivate: () => {},
	handleLabelKeyUp: () => {},
	handleOptionActivate: () => {},
	handleOptionKeyUp: () => {},
	hideOptions: () => {},
})





/**
 * An interactive component that displays a list of options when activated.
 *
 * @param {object} props All component props.
 * @param {string} [props.className] Classes to be applied to the rendered component.
 * @param {string} [props.id] A unique identifier for this component.
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
		id,
		isDisabled,
		isNavGroupDefault,
		labelClassName,
		navGroupID,
		navGroupLinks,
		onChange,
		options,
		value,
	} = props

	const isInitialRenderRef = useRef(true)

	const { focusNode } = useNavGraphContext()

	const comboboxID = useID()

	const [isOpen, setIsOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(options[0])

	const generateOptionKey = useCallback(option => `${comboboxID}-options-${option.value}`, [comboboxID])

	const hideOptions = useCallback(() => setIsOpen(false), [setIsOpen])
	const showOptions = useCallback(() => setIsOpen(true), [setIsOpen])

	const selectAndRevealOption = useCallback(option => {
		setSelectedOption(option)

		const optionKey = generateOptionKey(option)
		const element = document.querySelector(`[id="${optionKey}"]`)

		if (!isElementInView(element)) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}
	}, [
		generateOptionKey,
		setSelectedOption,
	])

	const selectOption = useCallback(option => {
		if (typeof onChange === 'function') {
			onChange(option)
		}

		if (value) {
			return
		}

		selectAndRevealOption(option)
	}, [
		generateOptionKey,
		onChange,
		setSelectedOption,
		value,
	])

	const handleLabelActivate = useCallback(() => {
		if (isDisabled) {
			return
		}

		if (isOpen) {
			hideOptions()
		} else if (!isOpen) {
			showOptions()
		}
	}, [
		isDisabled,
		hideOptions,
		isOpen,
		showOptions,
	])

	const handleLabelKeyUp = useCallback(event => {
		const { code } = event

		if (isDisabled) {
			return
		}

		if (isOpen && CLOSE_KEYS.includes(code)) {
			hideOptions()
		} else if (!isOpen && OPEN_KEYS.includes(code)) {
			showOptions()
		}
	}, [
		isDisabled,
		hideOptions,
		isOpen,
		showOptions,
	])

	const handleOptionActivate = useCallback(option => {
		selectOption(option)
		hideOptions()
	}, [
		hideOptions,
		selectOption,
	])

	const handleOptionDeactivate = useCallback(() => hideOptions(), [hideOptions])

	const handleOptionKeyUp = useCallback((event, option) => {
		const { code } = event

		if (CLOSE_KEYS.includes(code)) {
			if (code !== 'Escape') {
				selectOption(option)
			}

			hideOptions()
		}
	}, [
		hideOptions,
		selectOption,
	])

	const optionsNavGroupID = useMemo(() => `${navGroupID}-${comboboxID}-options`, [
		comboboxID,
		navGroupID,
	])

	const providerValue = useMemo(() => {
		return {
			className,
			comboboxID,
			emptyMessage,
			generateOptionKey,
			handleLabelActivate,
			handleLabelKeyUp,
			handleOptionActivate,
			handleOptionDeactivate,
			handleOptionKeyUp,
			hideOptions,
			id,
			isDisabled,
			isNavGroupDefault,
			isOpen,
			labelClassName,
			navGroupID,
			navGroupLinks,
			options,
			optionsNavGroupID,
			selectedOption,
		}
	}, [
		className,
		comboboxID,
		emptyMessage,
		generateOptionKey,
		handleLabelActivate,
		handleLabelKeyUp,
		handleOptionActivate,
		handleOptionDeactivate,
		handleOptionKeyUp,
		hideOptions,
		id,
		isDisabled,
		isNavGroupDefault,
		isOpen,
		labelClassName,
		navGroupID,
		navGroupLinks,
		options,
		optionsNavGroupID,
		selectedOption,
	])

	useLayoutEffect(() => {
		if (isDisabled) {
			setIsOpen(false)
		}
	}, [
		isDisabled,
		setIsOpen,
	])

	useLayoutEffect(() => {
		if (value && (value !== selectedOption)) {
			selectAndRevealOption(value)
		}
	}, [
		selectAndRevealOption,
		selectedOption,
		value,
	])

	useLayoutEffect(() => {
		if (isInitialRenderRef.current) {
			isInitialRenderRef.current = false
		} else if (isOpen) {
			focusNode(optionsNavGroupID)
		} else {
			focusNode(navGroupID)
		}
	}, [
		isInitialRenderRef,
		isOpen,
		navGroupID,
		optionsNavGroupID,
	])

	return (
		<ComboboxContext.Provider value={providerValue}>
			<ComboboxContainer />
		</ComboboxContext.Provider>
	)
}

Combobox.defaultProps = {
	className: '',
	emptyMessage: 'No options available.',
	id: null,
	isDisabled: false,
	isNavGroupDefault: false,
	navGroupLinks: [],
	onChange: null,
	options: [],
	value: null,
}

Combobox.propTypes = {
	className: PropTypes.string,
	emptyMessage: PropTypes.string,
	id: PropTypes.string,
	isDisabled: PropTypes.bool,
	isNavGroupDefault: PropTypes.bool,
	navGroupID: PropTypes.string.isRequired,
	navGroupLinks: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func,
	options: PropTypes.array,
	value: PropTypes.any,
}





export function useComboboxContext() {
	return useContext(ComboboxContext)
}
