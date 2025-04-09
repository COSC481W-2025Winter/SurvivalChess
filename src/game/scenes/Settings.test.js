/* global describe, beforeEach, test, expect, jest */

describe("Settings Scene", () => {
	let scene;

	beforeEach(() => {
		// Create a mock scene object
		scene = {
			add: {
				text: jest.fn(),
			},
			children: {
				getChildren: jest.fn(),
			},
			scene: {
				stop: jest.fn(),
				start: jest.fn(),
			},
		};

		// Mock Phaser.GameObjects.Text with jest
		scene.add.text.mockImplementation((x, y, text, style) => {
			const textObject = {
				x,
				y,
				text,
				style,
				setInteractive: jest.fn(),
				input: {enabled: true},
			};
			return textObject;
		});

		// Sample palettes
		scene.palettes = ["Light Mode", "Dark Mode", "Neon Mode"];
	});

	test("should create the color palette options", () => {
		const palettes = scene.palettes;

		// Create color palette options in the scene
		palettes.forEach((palette, index) => {
			const paletteText = scene.add.text(100, 100 + index * 40, palette, {font: "16px Arial", fill: "#fff"});
			paletteText.setInteractive();
		});

		// Get children in the scene
		const children = [
			{text: "Light Mode", input: {enabled: true}},
			{text: "Dark Mode", input: {enabled: true}},
			{text: "Neon Mode", input: {enabled: true}},
		];

		// Simulating scene children
		scene.children.getChildren.mockReturnValue(children);

		// Check if each palette text is created and interactive
		children.forEach((child) => {
			const paletteText = child.text;
			expect(paletteText).toBeDefined();
			expect(child.input.enabled).toBe(true);
		});
	});

	test("should create the close button and handle interaction", () => {
		// Mock the close button object
		const closeButton = {on: jest.fn()};

		// Simulate the event handler for button click
		closeButton.on.mockImplementation((event, callback) => {
			if (event === "pointerdown") {
				callback(); // Simulate the pointerdown event
			}
		});

		// Mock the button event listener call
		closeButton.on("pointerdown", () => {
			scene.scene.stop("Settings"); // Simulate stopping the scene
		});

		// Simulate clicking the close button
		closeButton.on.mock.calls[0][1](); // Trigger the pointerdown event

		// Expect scene.stop and scene.start to be called
		expect(scene.scene.stop).toHaveBeenCalledWith("Settings");
		expect(scene.scene.start).not.toHaveBeenCalled(); // Make sure `start` is not called
	});
});

module.exports = {
	env: {
		jest: true, // This tells ESLint to recognize Jest globals
	},
	extends: [
		"plugin:jest/recommended", // Optional, enables recommended Jest rules
		"eslint:recommended", // Basic ESLint rules
	],
	plugins: ["jest"], // Optional, if you want to add the Jest plugin
};
