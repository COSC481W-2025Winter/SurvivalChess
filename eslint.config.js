import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
	// Match files for JavaScript, JSX, and other JS-based file types
	{
		files: ["**/*.{js,mjs,cjs,jsx}"],
	},

	// Set global variables for browser and node
	{
		languageOptions: {
			globals: {...globals.browser, ...globals.node},
		},
	},

	// Import recommended configurations from eslint, react, and Prettier
	pluginJs.configs.recommended, // ESLint JS recommended rules
	pluginReact.configs.flat.recommended, // ESLint React recommended rules
	prettierConfig, // Prettier's default configuration
	{
		plugins: {
			"@stylistic/js": pluginJs,
			prettier: pluginPrettier, // Include Prettier plugin
		},
	},

	// Set specific rules
	{
		rules: {
			// REMOVED RULES
			// "no-duplicate-imports": "error", // Avoid duplicate imports
			// curly: ["error", "all"], // Ensure curly braces are used in control statements
			semi: "error", // Ensure semicolons at the end of statements
			"space-infix-ops": "error", // Ensure spacing around operators
			"@/max-len": ["warn", {code: 120}], // Ensure max length for lines
			"comma-spacing": ["error", {before: false, after: true}], // Ensure spaces after commas
			"array-bracket-spacing": ["error", "never"], // Ensure consistent spacing in brackets
			"object-curly-spacing": ["error", "never"], // Ensure consistent spacing in curly braces
			"space-before-blocks": ["error", "always"], // Ensure consistent spacing before blocks
			// Enforce one true brace style, which requires the opening brace to be on the same line
			"brace-style": ["error", "1tbs", {allowSingleLine: true}],
			"spaced-comment": ["error", "always", {markers: ["/"]}], // Ensures consistent comments
			"no-unused-vars": ["error", {args: "none"}], // Ensures no unused variables
			"prefer-const": "warn", // Ensures constants are used when they should be
			"no-console": ["warn"], // Warns of console.log being left in final code
			"no-undef": "warn", // This will set 'no-undef' to a warning
			indent: ["error", "tab", {SwitchCase: 1}], // 2 Spaces per tab
			"prettier/prettier": "error", // Make Prettier rules part of the linting process
		},
	},
];
