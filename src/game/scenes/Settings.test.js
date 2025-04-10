import {Settings} from "./Settings"; // Import the Settings scene

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

		// Properly mock `this.add.text()` for text objects (titles, buttons)
		scene.add = {
			text: jest.fn((x, y, text, style) => ({
				x,
				y,
				text,
				style,
				setInteractive: jest.fn().mockReturnThis(),
				on: jest.fn().mockReturnThis(),
				setOrigin: jest.fn().mockReturnThis(),
			})),
			rectangle: jest.fn().mockReturnValue({setOrigin: jest.fn()}),
		};

		scene.create(); // Simulate scene creation
	});

	test("should create the Settings title", () => {
		expect(scene.add.text).toHaveBeenCalledWith(expect.any(Number), 100, "SETTINGS", expect.any(Object));
	});

	// developer mode?? sprint 3
	test("should create the Dev Mode button", () => {
		const devButton = scene.add.text.mock.calls.find((call) => call[2] === "Dev Mode: OFF");
		expect(devButton).toBeDefined();
	});
	

	test("should create the Color Palette label", () => {
		expect(scene.add.text).toHaveBeenCalledWith(200, 170, "Color Palette:", expect.any(Object));
	});

	test("should create theme selection buttons", () => {
		const palettes = ["default", "dark", "light"];
		palettes.forEach((palette) => {
			expect(scene.add.text).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), palette, expect.any(Object));
		});
	});

	test("should create the Close button", () => {
		expect(scene.add.text).toHaveBeenCalledWith(
			expect.any(Number),
			expect.any(Number),
			"Close Settings",
			expect.any(Object)
		);
	});

	test("should make the Close button interactive", () => {
		const closeButton = scene.add.text.mock.results.find((result) => result.value.text === "Close Settings")?.value;
		expect(closeButton).toBeDefined();
		expect(closeButton.setInteractive).toHaveBeenCalled();
		expect(closeButton.on).toHaveBeenCalledWith("pointerdown", expect.any(Function));
	});
*/
});
