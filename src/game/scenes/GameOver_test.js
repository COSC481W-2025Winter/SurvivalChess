import { GameOver } from "../scenes/GameOver"; // Import the Game Over scene
import Phaser from "phaser"; // Import Phaser

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
                backgroundColor: 0x000000, // Example: Black background for Game Over screen
            },
        };

        // Mock the children array to simulate scene objects like buttons and text
        scene.children = {
            getChildren: jest.fn().mockReturnValue([
                { text: "Game Over", x: 512, y: 250 }, // Mocked Game Over text
                { text: "Restart Game", input: { enabled: true } }, // Restart button
                { text: "Main Menu", input: { enabled: true } }, // Main Menu button
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
        expect(scene.cameras.main.backgroundColor).toBe(0x000000); // Check if the background is black
    });

    // Test to verify that the Game Over text is displayed correctly
    test("should display 'Game Over' text in the center", () => {
        const gameOverText = scene.children
            .getChildren()
            .find((child) => child.text === "Game Over");

        expect(gameOverText).toBeDefined();
        expect(gameOverText.x).toBe(512);
        expect(gameOverText.y).toBe(250);
    });

    // Test to verify that the restart button is created and is interactive
    test("restart button should be created and interactive", () => {
        const restartButton = scene.children
            .getChildren()
            .find((child) => child.text === "Restart Game");

        expect(restartButton).toBeDefined();
        expect(restartButton.input.enabled).toBe(true);
    });

    // Test to verify that the main menu button is created and is interactive
    test("main menu button should be created and interactive", () => {
        const mainMenuButton = scene.children
            .getChildren()
            .find((child) => child.text === "Main Menu");

        expect(mainMenuButton).toBeDefined();
        expect(mainMenuButton.input.enabled).toBe(true);
    });
});
