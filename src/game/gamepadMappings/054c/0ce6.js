export const name = 'Sony DualSense Wireless Controller'

export const mapping = {
	axes: [
		{
			deadzone: {
				maximum: 0.03,
				minimum: -0.03,
			},
			index: 0,
			name: 'Left Stick (X Axis)',
		},
		{
			deadzone: {
				maximum: 0.03,
				minimum: -0.03,
			},
			index: 1,
			name: 'Left Stick (Y Axis)',
		},
		{
			deadzone: {
				maximum: 0.03,
				minimum: -0.03,
			},
			index: 2,
			name: 'Right Stick (X Axis)',
		},
		{
			deadzone: {
				maximum: 0.03,
				minimum: -0.03,
			},
			index: 3,
			name: 'Right Stick (Y Axis)',
		},
	],
	buttons: [
		{
			index: 0,
			name: 'X',
		},
		{
			index: 1,
			name: 'Circle',
		},
		{
			index: 2,
			name: 'Square',
		},
		{
			index: 3,
			name: 'Triangle',
		},
		{
			index: 4,
			name: 'L1',
		},
		{
			index: 5,
			name: 'R1',
		},
		{
			index: 6,
			name: 'L2',
		},
		{
			index: 7,
			name: 'R2',
		},
		{
			index: 8,
			name: 'Create',
		},
		{
			index: 9,
			name: 'Options',
		},
		{
			index: 10,
			name: 'Left Stick (Pressed)',
		},
		{
			index: 11,
			name: 'Right Stick (Pressed)',
		},
		{
			index: 12,
			name: 'D-Pad Up',
		},
		{
			index: 13,
			name: 'D-Pad Down',
		},
		{
			index: 14,
			name: 'D-Pad Left',
		},
		{
			index: 15,
			name: 'D-Pad Right',
		},
		{
			index: 16,
			name: 'Playstation',
		},
	],
}

export const template = {
	name: 'ps5',
}
