import {Settings} from "./Settings"; // Import the Settings scene

describe("Settings Scene", () => {
	let scene;

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
	// color code non implementation here?

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
});
