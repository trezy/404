// Module imports
import { useMemo } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'





export function ButtonStack(props) {
  const { children } = props

  const className = useMemo(() => {
    return classNames('button-stack', props.className)
  }, [props.className])

  return (
    <menu className={className}>
      {children}
    </menu>
  )
}

ButtonStack.defaultProps = {
  children: null,
  className: '',
}

ButtonStack.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
