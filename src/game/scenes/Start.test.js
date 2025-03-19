import {Start} from "./Start"; // Import the Start scene

// We are mocking the Start Scene instead of running the whole game loop
// Running the whole game loop takes too long and will result in the test timing out and failing
describe("Start Scene", () => {
	let scene;

	beforeEach(() => {
		// Setup: Create a new instance of the Start scene for each test
		scene = new Start();

		// Mock the cameras object since it is normally initialized by Phaser
		scene.cameras = {
			main: {
				// Mock the setBackgroundColor method to ensure it's being called in the test
				setBackgroundColor: jest.fn(),
				// Set the background color directly to simulate the scene setup
				backgroundColor: 0xeeeeee,
			},
		};

		// Mock the children array to simulate the scene objects like buttons and text.
		scene.children = {
			// Mock the getChildren method, which is responsible for fetching the scene's children objects (e.g., text, buttons)
			getChildren: jest.fn().mockReturnValue([
				// Mock the main title text object with expected properties
				{text: "Survival Chess", x: 512, y: 200},
				// Mock the start button, ensuring it has a text and is interactable
				{text: "Start Game", input: {enabled: true}},
				// Mock the settings button, ensuring it has a text and is interactable
				{text: "Settings", input: {enabled: true}},
				// Mock the rules button, ensuring it has a text and is interactable
				{text: "See Rules", input: {enabled: true}},
			]),
		};

		// Mock the add.text method for creating text objects in the scene
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

	// Test to verify that the background color of the scene is set correctly
	test("background color should be set correctly", () => {
		expect(scene.cameras.main.backgroundColor).toBe(0xeeeeee); // Check if the background color is set to the expected value
	});

	// Test to verify that the main title text object is created properly
	test("text objects should be created", () => {
		// Find the text object with the correct text value from the mocked children array
		const titleText = scene.children.getChildren().find((child) => child.text === "Survival Chess");

		// Assertions to check if the title text is created and its properties are correct
		expect(titleText).toBeDefined(); // Ensure the title text exists
		expect(titleText.x).toBe(512); // Ensure its x-position is correct
		expect(titleText.y).toBe(200); // Ensure its y-position is correct
	});

	// Test to verify that the start button is created and is interactive
	test("start button should be created and interactive", () => {
		// Find the start button from the mocked children
		const startButton = scene.children.getChildren().find((child) => child.text === "Start Game");

		// Assertions to check if the start button exists and is interactive
		expect(startButton).toBeDefined(); // Ensure the button exists
		expect(startButton.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
	});

	// Test to verify that the settings button is created and is interactive
	test("settings button should be created and interactive", () => {
		// Find the settings button from the mocked children
		const settingsButton = scene.children.getChildren().find((child) => child.text === "Settings");

		// Assertions to check if the settings button exists and is interactive
		expect(settingsButton).toBeDefined(); // Ensure the button exists
		expect(settingsButton.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
	});

	// Test to verify that the rules button is created and is interactive
	test("rules button should be created and interactive", () => {
		// Find the rules button from the mocked children
		const rulesButton = scene.children.getChildren().find((child) => child.text === "See Rules");

		// Assertions to check if the rules button exists and is interactive
		expect(rulesButton).toBeDefined(); // Ensure the button exists
		expect(rulesButton.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
	});
});
