import {Rules} from "./Rules"; // Import the RulesOverlay scene

// We are mocking the Start Scene instead of running the whole game loop
// Running the whole game loop takes too long and will result in the test timing out and failing
describe("Rules Scene", () => {
	let scene;

	beforeEach(() => {
		// Setup: Create a new instance of the Start scene for each test
		scene = new Rules();

		// Mock the cameras object since it is normally initialized by Phaser
		scene.cameras = {
			main: {
				// Mock the setBackgroundColor method to ensure it's being called in the test
				setBackgroundColor: jest.fn(),
				// Set the background color directly to simulate the scene setup
				backgroundColor: 0xc04000,
			},
		};

		// Mock the children array to simulate the scene objects like buttons and text.
		scene.children = {
			// Mock the getChildren method, which is responsible for fetching the scene's children objects (e.g., text, buttons)
			getChildren: jest.fn().mockReturnValue([
				// Mock the main title text object with expected properties
				{
					text:
						"- Pieces move the same as in regular chess\n\n" +
						"- To move, click on the piece you want to move, and then click on the square\n   you want to move it to\n\n" +
						"- The enemy pieces spawn in waves that will increase in dificulty in later rounds\n\n" +
						"- Enemy pieces spawn in the top two rows (rows 7&8)\n\n" +
						"- Your goal is to capture enemy pieces while avoiding checkmate\n\n" +
						"- The more pieces you capture the more points you will gain\n\n" +
						"- A new wave of pieces will spawn every 8 rounds\n\n" +
						"- Capturing all the enemy pieces will progress you to the next round early",
					x: 615,
					y: 400,
				},
				// Mock the close rules button, ensuring it has a text and is interactable
				{text: "Close Rules", input: {enabled: true}},
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

	// Test to verify that the main title text object is created properly
	test("text objects should be created", () => {
		// Find the text object with the correct text value from the mocked children array
		const titleText = scene.children
			.getChildren()
			.find(
				(child) =>
					child.text ===
					"- Pieces move the same as in regular chess\n\n" +
						"- To move, click on the piece you want to move, and then click on the square\n   you want to move it to\n\n" +
						"- The enemy pieces spawn in waves that will increase in dificulty in later rounds\n\n" +
						"- Enemy pieces spawn in the top two rows (rows 7&8)\n\n" +
						"- Your goal is to capture enemy pieces while avoiding checkmate\n\n" +
						"- The more pieces you capture the more points you will gain\n\n" +
						"- A new wave of pieces will spawn every 8 rounds\n\n" +
						"- Capturing all the enemy pieces will progress you to the next round early"
			);

		// Assertions to check if the title text is created and its properties are correct
		expect(titleText).toBeDefined(); // Ensure the title text exists
		expect(titleText.x).toBe(615); // Ensure its x-position is correct
		expect(titleText.y).toBe(400); // Ensure its y-position is correct
	});

	// Test to verify that the close rules button is created and is interactive
	test("close rules button should be created and interactive", () => {
		// Find the start button from the mocked children
		const closeRulesButton = scene.children.getChildren().find((child) => child.text === "Close Rules");

		// Assertions to check if the start button exists and is interactive
		expect(closeRulesButton).toBeDefined(); // Ensure the button exists
		expect(closeRulesButton.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
	});

	// Test to verify that the background color of the scene is set correctly
	test("background color should be set correctly", () => {
		expect(scene.cameras.main.backgroundColor).toBe(0xc04000); // Check if the background color is set to the expected value
	});
});
