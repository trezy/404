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
		'security',
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
		// eslint
		'no-unused-vars': 'error',
		'semi': ['error', 'never', {
			beforeStatementContinuationChars: 'always',
		}],
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

		// editorconfig
		'editorconfig/indent': ['error', {
			'SwitchCase': 1,
		}],

		// security
		'security/detect-object-injection': 'off',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
}
