// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import styles from './ComboboxButton.module.scss'

import { useComboboxContext } from './Combobox.jsx'





export function ComboboxButton(props) {
	const {
		children,
		className,
		id,
		onActivate,
		onKeyUp,
	} = props

	const { isDisabled } = useComboboxContext()

	const compiledClassName = useMemo(() => {
		return classnames(styles['button'], className, {
			[styles['is-disabled']]: isDisabled,
		})
	}, [className])

	return (
		/* eslint-disable-next-line react/forbid-elements */
		<button
			className={compiledClassName}
			id={id}
			onClick={onActivate}
			onKeyUp={onKeyUp}
			type={'button'}>
			{children}
		</button>
	)
}

ComboboxButton.defaultProps = {
	children: null,
	className: '',
}

ComboboxButton.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	id: PropTypes.string,
	onActivate: PropTypes.func.isRequired,
	onKeyUp: PropTypes.func.isRequired,
}
