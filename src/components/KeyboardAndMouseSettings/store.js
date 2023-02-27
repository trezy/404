// Module imports
import { configStore } from '../../helpers/configStore.js'
import { makeStore } from 'statery'





// Local imports
import { store as mainStore } from '../../newStore/store.js'





export const store = makeStore({
	activeKeys: null,
	bindingToRemap: null,
	isRemappingModalVisible: false,
})

export const hideRemappingModal = () => {
	store.set(() => ({ isRemappingModalVisible: false }))
}

export const showRemappingModal = options => {
	const {
		control,
		mode,
		primaryOrSecondary,
	} = options

	store.set(() => ({
		bindingToRemap: [control, mode, primaryOrSecondary],
		isRemappingModalVisible: true,
	}))
}

export const updateControlBinding = newBinding => {
	const [
		control,
		inputID,
		primaryOrSecondary,
	] = store.state.bindingToRemap

	mainStore.set(state => {
		const newControls = [...state.controls]
		const mappingKeys = ['primary', 'secondary']

		newControls.forEach(control => {
			mappingKeys.forEach(mappingKey => {
				const currentBinding = control.mappings[inputID][mappingKey]
				const lengthsMatch = currentBinding.length === newBinding.length

				if (lengthsMatch && currentBinding.every(code => newBinding.includes(code))) {
					control.mappings[inputID][mappingKey] = []
				}
			})
		})

		control.mappings[inputID][primaryOrSecondary] = [...newBinding]

		configStore.set('settings.controls', newControls)

		return { controls: newControls }
	})

	store.set(() => ({
		activeKeys: null,
		bindingToRemap: null,
	}))
}
