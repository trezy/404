// Module imports
import { makeStore } from 'statery'





export const store = makeStore({
	cursorOffset: {
		x: 0,
		y: 0,
	},
	globalOffset: {
		x: 0,
		y: 0,
	},
})
