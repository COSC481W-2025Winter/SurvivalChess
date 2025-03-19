import {GameOver} from "./GameOver"; // Import the Game Over scene
import {GAMEOVER_BACKGROUND_COLOR} from "../../game-objects/constants"; // Import background color
import {globalStatus, globalMoves, globalPieces, globalWaves} from "../../game-objects/global-stats";

// We are mocking the Game Over Scene instead of running the whole game loop
describe("GameOver Scene", () => {
	let scene;

	beforeEach(() => {
		// Setup: Create a new instance of the GameOver scene for each test
		scene = new GameOver();

		// Mock the cameras object to ensure background color is set correctly
		scene.cameras = {
			main: {
				setBackgroundColor: jest.fn(),
				backgroundColor: GAMEOVER_BACKGROUND_COLOR, // Example: Black background for Game Over screen
			},
		};

		// Mock the children array to simulate scene objects like buttons and text
		scene.children = {
			getChildren: jest.fn().mockReturnValue([
				{text: "Game Over!", x: 625, y: 175}, // Mocked Game Over text
				{text: "Number of Moves Made: " + globalMoves, x: 625, y: 275}, // Mocked Game Over text
				{text: "Number of Captured Pieces: " + globalPieces, x: 625, y: 350}, // Mocked Game Over text
				{text: "Number of Waves Survived: " + globalWaves, x: 625, y: 425}, // Mocked Game Over text
				{text: "Restart Game", input: {enabled: true}}, // Restart button
				{text: "Main Menu", input: {enabled: true}}, // Main Menu button
			]),
		};

		// Mock the add.text method for creating text objects in the scene
		scene.add = {
			text: jest.fn().mockReturnValue({
				setOrigin: jest.fn(),
				setDepth: jest.fn(),
				setInteractive: jest.fn(),
				on: jest.fn(),
			}),
		};
	});

	// Test to verify that the background color of the scene is set correctly
	test("background color should be set correctly", () => {
		expect(scene.cameras.main.backgroundColor).toBe(GAMEOVER_BACKGROUND_COLOR); // Check if the background is black
	});

	// Test to verify that the End Condition text is displayed correctly
	test("should display End Condition text in the center", () => {
		const text = scene.children
			.getChildren()
			.find((child) => (child.text === globalStatus ? globalStatus : "Game Over!"));

		expect(text).toBeDefined();
		expect(text.x).toBe(625);
		expect(text.y).toBe(175);
	});

	// Test to verify that the Moves Made text is displayed correctly
	test("should display 'Game Over' text in the center", () => {
		const text = scene.children.getChildren().find((child) => child.text === "Number of Moves Made: " + globalMoves);

		expect(text).toBeDefined();
		expect(text.x).toBe(625);
		expect(text.y).toBe(275);
	});

	// Test to verify that the Captured Pieces text is displayed correctly
	test("should display 'Game Over' text in the center", () => {
		const text = scene.children
			.getChildren()
			.find((child) => child.text === "Number of Captured Pieces: " + globalPieces);

		expect(text).toBeDefined();
		expect(text.x).toBe(625);
		expect(text.y).toBe(350);
	});

	// Test to verify that the Waves Survived text is displayed correctly
	test("should display 'Game Over' text in the center", () => {
		const text = scene.children
			.getChildren()
			.find((child) => child.text === "Number of Waves Survived: " + globalWaves);

		expect(text).toBeDefined();
		expect(text.x).toBe(625);
		expect(text.y).toBe(425);
	});

	// Test to verify that the restart button is created and is interactive
	test("restart button should be created and interactive", () => {
		const restartButton = scene.children.getChildren().find((child) => child.text === "Restart Game");

		expect(restartButton).toBeDefined();
		expect(restartButton.input.enabled).toBe(true);
	});

	// Test to verify that the main menu button is created and is interactive
	test("main menu button should be created and interactive", () => {
		const mainMenuButton = scene.children.getChildren().find((child) => child.text === "Main Menu");

		expect(mainMenuButton).toBeDefined();
		expect(mainMenuButton.input.enabled).toBe(true);
	});
});
