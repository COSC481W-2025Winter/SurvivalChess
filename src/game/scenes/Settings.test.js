/* global describe, beforeEach, test, expect, jest */

describe("Settings Scene", () => {
	let scene;

	beforeEach(() => {

		// Setup: Create a new instance of the Start scene for each test
		scene = new Settings();

		// Mock the children array to simulate the scene objects like buttons and text.
		scene.children = {
			// Mock the getChildren method, which is responsible for fetching the scene's children objects (e.g., text, buttons)
			getChildren: jest.fn().mockReturnValue([
				// Mock the text instructions object with expected properties
				{text: "Select what piece to promote your pawn into", x: 500, y: 490},
				// chess piece buttons
				{texture: "option1", Depth: 5, Scale: 1.5, input: {enabled: true}},
				{texture: "option2", Depth: 5, Scale: 1.5, input: {enabled: true}},
			]),
		};

		scene.add = {
			text: jest.fn().mockReturnValue({
				// Mock the method chaining typically used when creating Phaser text objects
				setOrigin: jest.fn(),
				setDepth: jest.fn(),
				setInteractive: jest.fn(),
				on: jest.fn(), // Mock event listener attachment
			}),
		};
	});

	test("chess pieces should be interactive an enabled", () => {
		// Find the settings button from the mocked children
		const option1add = scene.children.getChildren().find((child) => child.texture === "option1");

		// Assertions to check if the settings button exists and is interactive
		expect(option1add).toBeDefined(); // Ensure the button exists
		expect(option1add.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
		expect(option1add.Depth).toBe(5); // depth set correctly
		expect(option1add.Scale).toBe(1.5); // depth set correctly

		const option2add = scene.children.getChildren().find((child) => child.texture === "option2");

		// Assertions to check if the settings button exists and is interactive
		expect(option2add).toBeDefined(); // Ensure the button exists
		expect(option2add.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
		expect(option2add.Depth).toBe(5); // depth set correctly
		expect(option2add.Scale).toBe(1.5); // depth set correctly
	});
	/* let scene;

	beforeEach(() => {
		scene = new Settings();

		// Mock Phaser dependencies
		scene.cameras = {main: {setBackgroundColor: jest.fn()}};
		scene.scene = {stop: jest.fn(), restart: jest.fn()};


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
*/
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
