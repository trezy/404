// Module imports
import { useEffect } from 'react'
import * as Rafael from 'rafael'





/**
 * Manages scheduled tasks with Rafael.
 *
 * @param {object} config Configuration for the hook.
 * @param {Function} config.task The task to be added to the Rafael schedule.
 * @param {object} [config.options] An options object that will be passed directly to Rafael.
 * @param {Array} [config.dependencies] A list of dependencies that, upon change, will cause the hook to reset.
 */
export function useRafael(config) {
	const {
		dependencies = [],
		options = {},
		task,
	} = config

	useEffect(() => {
		const taskID = Rafael.schedule(task, options)
		return () => {
			Rafael.unschedule(taskID)
		}
	}, [
		// eslint-disable-next-line react-hooks/exhaustive-deps
		...dependencies,
		options,
		task,
	])
}
