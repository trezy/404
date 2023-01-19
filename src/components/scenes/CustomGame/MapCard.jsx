// Module imports
import numeral from 'numeral'
import PropTypes from 'prop-types'
import { Button } from '../../Button.jsx'





// Local imports
import styles from './MapCard.module.scss'

import { ButtonGroup } from '../../ButtonGroup/ButtonGroup.jsx'





/**
 * Renders a map for selection.
 *
 * @component
 */
export function MapCard(props) {
	const { map } = props

	return (
		<li
			key={map.id}
			className={styles['map-card-wrapper']}>
			<div className={styles['map-card']}>
				<div className={styles['thumbnail']}>
					<img
						alt={''}
						src={'https://via.placeholder.com/267x150'} />
				</div>

				<div className={styles['details']}>
					<header className={styles['name']}>
						{map.name}
					</header>

					<div className={styles['description']}>
						<p>{'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pulvinar rutrum erat, eget luctus magna.'}</p>
					</div>

					<dl className={styles['stats']}>
						<dt>{'Downloads'}</dt>
						<dd>{'1234'}</dd>

						<dt>{'High Score'}</dt>
						<dd>{'450000'}</dd>

						<dt>{'Size'}</dt>
						<dd>{numeral(map.size).format('0.00 b')}</dd>

						<dt>{'Version'}</dt>
						<dd>{map.version}</dd>
					</dl>
				</div>
			</div>

			<menu
				className={styles['controls']}
				type={'toolbar'}>
				<ButtonGroup>
					<Button isAffirmative>
						{'Play'}
					</Button>
				</ButtonGroup>
			</menu>
		</li>
	)
}

MapCard.propTypes = {
	map: PropTypes.object.isRequired,
}
