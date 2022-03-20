module.exports = {
	env: {
		browser: true,
		es2022: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:editorconfig/all',
		'plugin:jsdoc/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:optimize-regex/recommended',
		'plugin:promise/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'plugin:react-perf/recommended',
		'plugin:security/recommended',
	],
	plugins: [
		'editorconfig',
		'sort-class-members',
		'unused-imports',
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: 'module',
	},
	rules: {
		'no-unused-vars': 'error',
		'sort-class-members/sort-class-members': ['error', {
			accessorPairPositioning: 'getThenSet',
			order: [
				'[static-properties]',
				'[static-methods]',
				'[conventional-private-properties]',
				'[properties]',
				'constructor',
				'[methods]',
				'[conventional-private-methods]',
			],
		}],
		'editorconfig/indent': ['error', {
			'SwitchCase': 1,
		}]
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
}
