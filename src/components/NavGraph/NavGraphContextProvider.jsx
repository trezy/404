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
import { Gamepad } from '../../game/Gamepad.js'
import { store } from '../../newStore/store.js'





// Constants
const NavGraphContext = createContext({
	currentTargetNodeID: null,
	graph: null,

	activateNode: () => {},
	createLink: () => {},
	createNode: () => {},
	destroyNode: () => {},
	focusNode: () => {},
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
 * @property {Function} [onActivate] A function to be called when this component's node is activated.
 * @property {Function} [onDeactivate] A function to be called when this component's node is deactivated.
 * @property {Function} [onFocus] A function to be called when this component's node is focused.
 * @property {React.MutableRefObject<HTMLElement>} targetRef A react Ref pointing to the element to be used for distance and angle checks.
 */





export function NavGraphContextProvider(props) {
	const { children } = props

	const { controlsManager } = useStore(store)

	const [axes, setAxes] = useState({
		x: {
			direction: 0,
			isActivated: false,
			isHandled: true,
		},
		y: {
			direction: 0,
			isActivated: false,
			isHandled: true,
		},
	})
	const [currentTargetNodeID, setCurrentTargetNodeID] = useState(null)
	const [gamepadUpdate, setGamepadUpdate] = useState({})
	const [graph] = useState(createGraph())

	/**
	 * Traverses the graph to find adjacent nodes.
	 *
	 * @param {object} options All options.
	 * @param {Set} options.adjacentNodes A set of adjacent nodes that have already been discovered.
	 * @param {Set} options.checkedNodes A set of nodes that have already been checked. Prevents duplicate checking and infinite loops.
	 * @param {string} options.sourceNodeID The ID of the node to start from.
	 */
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

			if (!node.data) {
				return
			}

			if (node.data?.isGroup) {
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

	/**
	 * Activate a node.
	 *
	 * @param {string} nodeID The ID of the node to be activated.
	 */
	const activateNode = useCallback(nodeID => {
		const node = graph.getNode(nodeID)

		if (typeof node.data.onActivate === 'function') {
			node.data.onActivate()
		}
	}, [graph])

	/**
	 * Deactivate a node.
	 *
	 * @param {string} nodeID The ID of the node to be deactivated.
	 */
	const deactivateNode = useCallback(nodeID => {
		const node = graph.getNode(nodeID)

		if (typeof node.data.onDeactivate === 'function') {
			node.data.onDeactivate()
		}
	}, [graph])

	/**
	 * Creates a link between two nodes.
	 *
	 * @param {string} nodeIDA The node from which the link will be created.
	 * @param {string} nodeIDB The node to which the link will be created.
	 */
	const createLink = useCallback((nodeIDA, nodeIDB) => {
		if (!graph.getLink(nodeIDA, nodeIDB)) {
			graph.addLink(nodeIDA, nodeIDB)
		}
	}, [graph])

	/**
	 * Creates a new node and adds it to the graph. This will also create the node's group (if it doesn't exist yet) and link the node to the group.
	 *
	 * @param {NavGraphNodeOptions} options Options for the node to be created.
	 */
	const createNode = useCallback(options => {
		const {
			groupID,
			id,
			isDefault = false,
			onActivate,
			onDeactivate,
			onFocus,
			targetRef,
		} = options

		let nodeProps = {
			groupID,
			onActivate,
			onDeactivate,
			onFocus,
			targetRef,
		}

		if (!groupID || !targetRef || (typeof onActivate !== 'function')) {
			return null
		}

		if (!groupID) {
			throw new Error('`groupID` is required.')
		}

		if (typeof onActivate !== 'function') {
			throw new Error('`onActivate` must be a function.')
		}

		if (Boolean(onDeactivate) && (typeof onDeactivate !== 'function')) {
			throw new Error('`onDeactivate` must be a function.')
		}

		if (Boolean(onFocus) && (typeof onFocus !== 'function')) {
			throw new Error('`onFocus` must be a function.')
		}

		if (!targetRef) {
			throw new Error('`targetRef` is required.')
		}

		/**
		 * Add bidirectional links between this node and the node group.
		 */
		createLink(id, groupID)
		createLink(groupID, id)

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
			groupNode.data.defaultTarget = id
		}

		/**
		 * Add this node to the graph.
		 */
		graph.addNode(id, nodeProps)
	}, [
		createLink,
		graph,
	])

	/**
	 * Destroys a node, removing it from the graph.
	 *
	 * @param {string} nodeID The ID of the node to be destroyed.
	 */
	const destroyNode = useCallback(nodeID => {
		let groupNodeID = null
		let isGroupEmpty = true

		/**
		 * Remove all links on this node.
		 */
		graph.forEachLinkedNode(nodeID, (linkedNode, link) => {
			/**
			 * Capture the group ID.
			 */
			groupNodeID = linkedNode.id

			graph.removeLink(link)
		}, true)

		/**
		 * Remove this node from the graph.
		 */
		graph.removeNode(nodeID)

		/**
		 * Capture the group's node.
		 */
		const groupNode = graph.getNode(groupNodeID)

		if (groupNode?.data.defaultTarget === nodeID) {
			groupNode.data.defaultTarget = null
		}

		/**
		 * Loop over all nodes attached to the destroyed node's group to check if
		 * any links remain to non-group nodes.
		 */
		graph.forEachLinkedNode(groupNodeID, node => {
			if (!isGroupEmpty) {
				return
			}

			if (node?.data && !node.data.isGroup) {
				isGroupEmpty = false
			}
		}, true)

		/**
		 * Destroy the associated group node if it's empty.
		 */
		if (isGroupEmpty) {
			graph.removeNode(groupNodeID)
		}
	}, [graph])

	/**
	 * @function focusNode Transfer focus to a node.
	 *
	 * @param {string} nodeID The ID of the node to transfer focus to.
	 */
	const focusNode = useCallback(nodeID => {
		if (!graph.hasNode(nodeID)) {
			return
		}

		let node = graph.getNode(nodeID)

		const {
			defaultTarget,
			isGroup,
			onFocus,
		} = node?.data ?? {}

		if (onFocus) {
			node.data.onFocus(node)
		}

		if (isGroup) {
			if (defaultTarget) {
				focusNode(defaultTarget)
			}

			return
		}

		setCurrentTargetNodeID(nodeID)
	}, [
		getAdjacentNodeIDs,
		graph,
		setCurrentTargetNodeID,
	])

	/**
	 * Fired when a gamepad's joystick axis has changed.
	 */
	const handleAxisChanged = useCallback(event => {
		const {
			index,
			state,
		} = event

		const absoluteState = Math.abs(state)
		const axisKey = [0, 2].includes(index) ? 'x' : 'y'
		const axisIsActivated = axes[axisKey]?.isActivated

		if (!axisIsActivated && (absoluteState > 0.5)) {
			setAxes(previousState => {
				return {
					...previousState,
					[axisKey]: {
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
					[axisKey]: {
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

	/**
	 * Fired when a gamepad button is pressed.
	 */
	const handleButtonPressed = useCallback(event => {
		const { index } = event

		if (index === 0) {
			return activateNode(currentTargetNodeID)
		}

		if (index === 1) {
			return deactivateNode(currentTargetNodeID)
		}

		let axis = null
		let direction = null

		// D-pad Up
		if (index === 12) {
			axis = 'y'
			direction = -1

		// D-pad Down
		} else if (index === 13) {
			axis = 'y'
			direction = 1

		// D-pad Left
		} else if (index === 14) {
			axis = 'x'
			direction = -1

		// D-pad Right
		} else if (index === 15) {
			axis = 'x'
			direction = 1
		}

		if (axis && direction) {
			setAxes(previousState => ({
				...previousState,
				[axis]: {
					direction,
					isActivated: true,
					isHandled: false,
				},
			}))
		}
	}, [
		activateNode,
		currentTargetNodeID,
		deactivateNode,
		graph,
		setAxes,
	])

	/**
	 * Fired when a gamepad button is released.
	 */
	const handleButtonReleased = useCallback(event => {
		const { index } = event

		let axis = null

		// D-pad Up/Down
		if ([12, 13].includes(index)) {
			axis = 'x'

		// D-pad Right/Left
		} else if ([14, 15].includes(index)) {
			axis = 'y'
		}

		if (axis) {
			setAxes(previousState => ({
				...previousState,
				[axis]: {
					isActivated: false,
					isHandled: false,
				},
			}))
		}
	}, [setAxes])

	/**
	 * Fired when a gamepad is connected of disconnected. Forces an update for things that depend on gamepads.
	 */
	const handleGamepadChange = useCallback(() => setGamepadUpdate({}), [setGamepadUpdate])

	/**
	 * Binds all events we need to react to on a gamepad.
	 *
	 * @param {Gamepad} gamepad The gamepad to which events will be bound.
	 */
	const bindGamepadEvents = useCallback(gamepad => {
		gamepad.on('button pressed', handleButtonPressed)
		gamepad.on('button released', handleButtonReleased)
		gamepad.on('axis changed', handleAxisChanged)
	}, [
		handleAxisChanged,
		handleButtonPressed,
		handleButtonReleased,
	])

	/**
	 * Unbinds all events we're currently watching for on a gamepad.
	 *
	 * @param {Gamepad} gamepad The gamepad from which events will be unbound.
	 */
	const unbindGamepadEvents = useCallback(gamepad => {
		gamepad.off('button pressed', handleButtonPressed)
		gamepad.off('axis changed', handleAxisChanged)
	}, [
		handleAxisChanged,
		handleButtonPressed,
	])

	const providerValue = useMemo(() => ({
		createLink,
		createNode,
		currentTargetNodeID,
		deactivateNode,
		destroyNode,
		focusNode,
		graph,
	}), [
		createLink,
		createNode,
		currentTargetNodeID,
		deactivateNode,
		destroyNode,
		focusNode,
		graph,
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
			.forEach(([axisKey, state]) => {
				const {
					direction,
					isActivated,
					isHandled,
				} = state

				if (isActivated && !isHandled) {
					const currentNode = graph.getNode(currentTargetNodeID)

					if (!currentNode) {
						return
					}

					const currentNodeBoundingRect = currentNode.data.targetRef.current.getBoundingClientRect()

					const nearestNode = getAdjacentNodeIDs({ sourceNodeID: currentTargetNodeID })
						.map(id => graph.getNode(id))
						.filter(node => {
							if (!node) {
								return false
							}

							const boundingRect = node.data.targetRef.current.getBoundingClientRect()

							// Horizontal axis
							if (axisKey === 'x') {
								// Moving right
								if (direction === 1) {
									return currentNodeBoundingRect.left < boundingRect.left
								}

								// Moving left
								return currentNodeBoundingRect.right > boundingRect.right
							}

							// Vertical axis
							if (axisKey === 'y') {
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
							[axisKey]: {
								...previousState[axisKey],
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

	window.navGraph = graph

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
 * Adds a component to the nav graph.
 *
 * @param {NavGraphNodeOptions} options All options.
 */
export function useNavGraphNode(options, dependencies = []) {
	const internalID = useID()

	const {
		groupID,
		groupLinks,
		id = internalID,
		isDefault,
		onActivate,
		onDeactivate,
		onFocus,
		targetRef,
	} = options

	const {
		createLink,
		createNode,
		destroyNode,
	} = useNavGraphContext()

	useLayoutEffect(() => {
		createNode({
			groupID,
			id,
			isDefault,
			onActivate,
			onDeactivate,
			onFocus,
			targetRef,
		})

		groupLinks.forEach(targetNodeID => {
			createLink(groupID, targetNodeID)
			createLink(targetNodeID, groupID)
		})

		return () => destroyNode(id)
	}, dependencies)
}
