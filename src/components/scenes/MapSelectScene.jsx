// Local imports
import { Button } from '../Button.jsx'
import { ButtonStack } from '../ButtonStack.jsx'
import { Panel } from '../Panel.jsx'
import { PanelsLayout } from '../layouts/PanelsLayout.jsx'
import { Scene } from '../Scene.jsx'
import { useStore } from '../../store/react.js'





export function MapSelectScene() {
	const [
		goToSettings,
		goToTitle,
	] = useStore(state => [
		state.goToSettings,
		state.goToTitle,
	])

	return (
		<Scene id="map-select">
			<PanelsLayout id="title">
				<Panel>
					<h2>{'Menu'}</h2>

					<ButtonStack className="panel-bottom">
						<Button>
							{'Statistics'}
						</Button>

						<Button onClick={goToSettings}>
							{'Settings'}
						</Button>

						<Button onClick={goToTitle}>
							{'Main Menu'}
						</Button>
					</ButtonStack>
				</Panel>

				<Panel columnSpan={3}>
					<h2>{'Map Select'}</h2>

					<table>
						<tbody>
							<tr>
								<th>{'Level 1'}</th>

								<td>{'00:00'}</td>

								<td>{'⭐⭐⭐⭐⭐'}</td>

								<td>
									<Button
										isPrimary
										isSmall>
										{'Load'}
									</Button>
								</td>
							</tr>

							<tr>
								<th>{'Level 2'}</th>

								<td>{'00:00'}</td>

								<td>{'⭐⭐⭐⭐⭐'}</td>

								<td>
									<Button
										isPrimary
										isSmall>
										{'Load'}
									</Button>
								</td>
							</tr>

							<tr>
								<th>{'Level 3'}</th>

								<td>{'00:00'}</td>

								<td>{'⭐⭐⭐⭐⭐'}</td>

								<td>
									<Button
										isPrimary
										isSmall>
										{'Load'}
									</Button>
								</td>
							</tr>

							<tr>
								<th>{'Level 4'}</th>

								<td>{'00:00'}</td>

								<td>{'⭐⭐⭐⭐⭐'}</td>

								<td>
									<Button
										isPrimary
										isSmall>
										{'Load'}
									</Button>
								</td>
							</tr>

							<tr>
								<th>{'Level 5'}</th>

								<td>{'00:00'}</td>

								<td>{'⭐⭐⭐⭐⭐'}</td>

								<td>
									<Button
										isPrimary
										isSmall>
										{'Load'}
									</Button>
								</td>
							</tr>
						</tbody>
					</table>
				</Panel>
			</PanelsLayout>
		</Scene>
	)
}
