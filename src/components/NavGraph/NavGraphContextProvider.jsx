// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useId as useID,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react'
import createGraph from 'ngraph.graph'
import { useStore } from 'statery'





// Local imports
import { store } from '../../newStore/store.js'





// Constants
const NavGraphContext = createContext({
	currentTargetNodeID: null,
	graph: null,

	activateNode: () => {},
	createLink: () => {},
	createNode: () => {},
	destroyNode: () => {},
	setTargetNodeID: () => {},
})





/**
 * Calculates the distance between nodes based on their elements' screen space
 * positions.
 *
 * @param {object} nodeA
 * @param {object} nodeB
 * @returns {number} The distance between the two nodes in pixels.
 */
function getDistanceBetweenNodes(nodeA, nodeB) {
	const boundingRectA = nodeA.data.targetRef.current.getBoundingClientRect()
	const boundingRectB = nodeB.data.targetRef.current.getBoundingClientRect()

	let xDistance = 0
	let yDistance = 0

	if (boundingRectA.left > boundingRectB.right) {
		xDistance = boundingRectA.left - boundingRectB.right
	} else if (boundingRectA.right < boundingRectB.left) {
		xDistance = boundingRectA.right - boundingRectB.left
	} else {
		const centerA = boundingRectA.left + (boundingRectA.width / 2)
		const centerB = boundingRectB.left + (boundingRectB.width / 2)

		xDistance = centerA - centerB
	}

	if (boundingRectA.top > boundingRectB.bottom) {
		yDistance = boundingRectA.top - boundingRectB.bottom
	} else if (boundingRectA.bottom < boundingRectB.top) {
		yDistance = boundingRectA.bottom - boundingRectB.top
	} else {
		const centerA = boundingRectA.top + (boundingRectA.height / 2)
		const centerB = boundingRectB.top + (boundingRectB.height / 2)

		yDistance = centerA - centerB
	}

	return (xDistance ** 2) + (yDistance ** 2)
}





// Types
/**
 * @typedef NavGraphNodeOptions
 * @property {string} groupID The group this component belongs to within the graph.
 * @property {string} [id] The identifier to use for the node representing this component in the graph.
 * @property {boolean} [isDefault = false] Whether this is the default node for its group.
 * @property {Function} onActivate A function to be called when this component's node is activated.
 * @property {Function} onFocus A function to be called when this component's node is focused.
 * @property {React.MutableRefObject<HTMLElement>} targetRef A react Ref pointing to the element to be used for distance and angle checks.
 */





export function NavGraphContextProvider(props) {
	const { children } = props

	const { controlsManager } = useStore(store)

	const [axes, setAxes] = useState({})
	const [currentTargetNodeID, setCurrentTargetNodeID] = useState(null)
	const [gamepadUpdate, setGamepadUpdate] = useState({})
	const [graph] = useState(createGraph())

	const activateNode = useCallback(id => {
		const node = graph.getNode(id)

		if (typeof node.data.onActivate === 'function') {
			node.data.onActivate()
		}
	}, [graph])

	const createLink = useCallback((nodeAID, nodeBID) => {
		graph.addLink(nodeAID, nodeBID)
	}, [graph])

	const createNode = useCallback(options => {
		const {
			groupID,
			id,
			isDefault = false,
			onActivate,
			targetRef,
		} = options

		let nodeProps = {
			groupID,
			onActivate,
			targetRef,
		}

		if (!groupID) {
			throw new Error('`groupID` is required.')
		}

		if (typeof onActivate !== 'function') {
			throw new Error('`onActivate` must be a function.')
		}

		if (!targetRef) {
			throw new Error('`targetRef` is required.')
		}

		/**
		 * Add bidirectional links between this node and the node group.
		 */
		graph.addLink(id, groupID)
		graph.addLink(groupID, id)

		const groupNode = graph.getNode(groupID)

		/**
		 * Initialise group data (if necessary).
		 */
		if (!groupNode.data) {
			groupNode.data = {
				defaultTarget: null,
				isGroup: true,
			}
		}

		/**
		 * Set this as the group's default node if necessary.
		 */
		if (isDefault) {
			const groupNode = graph.getNode(groupID)
			groupNode.data.defaultTarget = id
		}

		/**
		 * Add this node to the graph.
		 */
		graph.addNode(id, nodeProps)
	}, [graph])

	const destroyNode = useCallback(id => {
		let groupID = null
		let isGroupEmpty = true

		/**
		 * Remove all links on this node.
		 */
		graph.forEachLink(id, link => {
			/**
			 * If the node on the other end of this link represents the node group, capture its ID.
			 */
			if (link.toId !== id) {
				groupID = link.toId
			}

			graph.removeLink(link)
		})

		/**
		 * Remove this node from the graph.
		 */
		graph.removeNode(id)

		/**
		 * Loop over all nodes attached to the destroyed node's group to check if
		 * any links remain to non-group nodes.
		 */
		graph.forEachLinkedNode(groupID, node => {
			if (!isGroupEmpty) {
				return
			}

			if (!node.data.isGroup) {
				isGroupEmpty = false
			}
		}, true)

		/**
		 *
		 * Destroy the associated group node if it's empty.
		 */
		if (isGroupEmpty) {
			graph.removeNode(groupID)
		}
	}, [graph])

	const focusNode = useCallback(id => {
		const node = graph.getNode(id)

		if (typeof node.data.onFocus === 'function') {
			node.data.onFocus()
		} else {
			setCurrentTargetNodeID(id)
		}
	}, [
		graph,
		setCurrentTargetNodeID,
	])

	const getAdjacentNodeIDs = useCallback(options => {
		const {
			adjacentNodes = new Set,
			checkedNodes = new Set,
			sourceNodeID,
		} = options

		const originNodeID = options.originNodeID ?? sourceNodeID
		const originNodeGroupID = graph.getNode(originNodeID).data.groupID

		/**
		 * Loop over all outbound links from the current target node.
		 */
		graph.forEachLinkedNode(sourceNodeID, node => {
			if (checkedNodes.has(node.id)) {
				return
			}

			checkedNodes.add(node.id)

			if (node.data.isGroup) {
				if ((node.id === originNodeGroupID) || !node.data.defaultTarget) {
					getAdjacentNodeIDs({
						adjacentNodes,
						checkedNodes,
						originNodeID,
						sourceNodeID: node.id,
					})

				} else {
					adjacentNodes.add(node.data.defaultTarget)
				}
			} else {
				adjacentNodes.add(node.id)
			}
		}, true)

		adjacentNodes.delete(sourceNodeID)

		if (sourceNodeID === originNodeID) {
			return Array.from(adjacentNodes)
		}

		return adjacentNodes
	}, [graph])

	const handleAxisChanged = useCallback(event => {
		const {
			index,
			state,
		} = event

		const absoluteState = Math.abs(state)
		const axisIsActivated = axes[index]?.isActivated

		if (!axisIsActivated && (absoluteState > 0.5)) {
			setAxes(previousState => {
				return {
					...previousState,
					[index]: {
						direction: Math.sign(state),
						isActivated: true,
						isHandled: false,
					},
				}
			})
		} else if (axisIsActivated && (absoluteState < 0.5)) {
			setAxes(previousState => {
				return {
					...previousState,
					[index]: {
						isActivated: false,
						isHandled: false,
					},
				}
			})
		}
	}, [
		activateNode,
		axes,
		currentTargetNodeID,
		graph,
	])

	const handleButtonPressed = useCallback(event => {
		const { index } = event

		if (index === 0) {
			activateNode(currentTargetNodeID)
		}
	}, [
		activateNode,
		currentTargetNodeID,
		graph,
	])

	const handleGamepadChange = useCallback(() => setGamepadUpdate({}), [setGamepadUpdate])

	const bindGamepadEvents = useCallback(gamepad => {
		gamepad.on('button pressed', handleButtonPressed)
		gamepad.on('axis changed', handleAxisChanged)
	}, [
		handleAxisChanged,
		handleButtonPressed,
	])

	const unbindGamepadEvents = useCallback(gamepad => {
		gamepad.off('button pressed', handleButtonPressed)
		gamepad.off('axis changed', handleAxisChanged)
	}, [
		handleAxisChanged,
		handleButtonPressed,
	])

	const setTargetNodeID = useCallback(id => setCurrentTargetNodeID(id), [setCurrentTargetNodeID])

	const providerValue = useMemo(() => ({
		createLink,
		createNode,
		currentTargetNodeID,
		destroyNode,
		graph,
		setTargetNodeID,
	}), [
		createLink,
		createNode,
		currentTargetNodeID,
		destroyNode,
		graph,
		setTargetNodeID,
	])

	useLayoutEffect(() => {
		const gamepad = controlsManager.getGamepad(0)

		controlsManager.on('gamepad connected', handleGamepadChange)
		controlsManager.on('gamepad disconnected', handleGamepadChange)

		if (gamepad) {
			bindGamepadEvents(gamepad)
		}

		return () => {
			controlsManager.off('gamepad connected', handleGamepadChange)
			controlsManager.off('gamepad disconnected', handleGamepadChange)

			if (gamepad) {
				unbindGamepadEvents(gamepad)
			}
		}
	}, [
		bindGamepadEvents,
		controlsManager,
		gamepadUpdate,
		handleGamepadChange,
		unbindGamepadEvents,
	])

	useLayoutEffect(() => {
		Object
			.entries(axes)
			.forEach(([index, state]) => {
				const {
					direction,
					isActivated,
					isHandled,
				} = state

				if (isActivated && !isHandled) {
					const currentNode = graph.getNode(currentTargetNodeID)
					const currentNodeBoundingRect = currentNode.data.targetRef.current.getBoundingClientRect()

					const nearestNode = getAdjacentNodeIDs({ sourceNodeID: currentTargetNodeID })
						.map(id => graph.getNode(id))
						.filter(node => {
							const boundingRect = node.data.targetRef.current.getBoundingClientRect()

							// Horizontal axis
							if (['0', '2'].includes(index)) {
								// Moving right
								if (direction === 1) {
									return currentNodeBoundingRect.left < boundingRect.left
								}

								// Moving left
								return currentNodeBoundingRect.right > boundingRect.right
							}

							// Vertical axis
							if (['1', '3'].includes(index)) {
								// Moving down
								if (direction === 1) {
									return currentNodeBoundingRect.top < boundingRect.top
								}

								// Moving up
								return currentNodeBoundingRect.bottom > boundingRect.bottom
							}
						})
						.reduce((accumulator, node) => {
							if (accumulator === null) {
								return node
							}

							const distanceA = getDistanceBetweenNodes(currentNode, accumulator)
							const distanceB = getDistanceBetweenNodes(currentNode, node)

							if (distanceA > distanceB) {
								return node
							}

							return accumulator
						}, null)

					setAxes(previousState => {
						return {
							...previousState,
							[index]: {
								...previousState[index],
								isHandled: true,
							},
						}
					})

					if (nearestNode) {
						focusNode(nearestNode.id)
					}
				}
			})
	}, [
		axes,
		currentTargetNodeID,
		focusNode,
		getAdjacentNodeIDs,
		graph,
		setAxes,
	])

	return (
		<NavGraphContext.Provider value={providerValue}>
			{children}
		</NavGraphContext.Provider>
	)
}

/**
 * Allows access to the internals of the NavGraph Context.
 */
export function useNavGraphContext() {
	return useContext(NavGraphContext)
}


/**
 * Adds components to the nav graph.
 *
 * @param {NavGraphNodeOptions} options All options.
 */
export function useNavGraph(options) {
	const internalID = useID()

	const {
		id = internalID,
		links = [],
		nodes = [],
	} = options

	const {
		createLink,
		createNode,
		destroyNode,
	} = useNavGraphContext()

	useLayoutEffect(() => {
		nodes.forEach(node => {
			createNode({
				...node,
				groupID: id,
			})
		})

		links.forEach(targetNodeID => createLink(id, targetNodeID))

		return () => nodes.forEach(node => destroyNode(node.id))
	}, [
		id,
		links,
		nodes,
	])
}
