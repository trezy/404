// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'





export function Panel(props) {
  const {
    children,
    columnSpan,
    isCentered,
  } = props

  const className = classnames('panel', `span-${columnSpan}`, props.className, {
    'is-centered': isCentered,
  })

  return (
    <div className={className}>
      {children}
    </div>
  )
}

Panel.defaultProps = {
  children: null,
  columnSpan: 1,
  isCentered: false,
}

Panel.propTypes = {
  children: PropTypes.node,
  columnSpan: PropTypes.oneOf([1, 2, 3, 4]),
  isCentered: PropTypes.bool,
}
