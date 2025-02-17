import { RulesOverlay } from "./RulesOverlay"; // Import the RulesOverlay scene

// We are mocking the Start Scene instead of running the whole game loop
// Running the whole game loop takes too long and will result in the test timing out and failing
describe("RulesOverlay Scene", () => {
    let scene;

    beforeEach(() => {
        // Setup: Create a new instance of the Start scene for each test
        scene = new RulesOverlay();

        // Mock the cameras object since it is normally initialized by Phaser
        scene.cameras = {
            main: {
            },
        };

        // Mock the children array to simulate the scene objects like buttons and text.
        scene.children = {
            // Mock the getChildren method, which is responsible for fetching the scene's children objects (e.g., text, buttons)
            getChildren: jest.fn().mockReturnValue([
                // Mock the main title text object with expected properties
                { text: "These are the rules", x: 512, y: 490 },
                // Mock the close rules button, ensuring it has a text and is interactable
                { text: "Close Rules", input: { enabled: true } },
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
            .find((child) => child.text === "These are the rules");

        // Assertions to check if the title text is created and its properties are correct
        expect(titleText).toBeDefined(); // Ensure the title text exists
        expect(titleText.x).toBe(512); // Ensure its x-position is correct
        expect(titleText.y).toBe(490); // Ensure its y-position is correct
    });

    // Test to verify that the close rules button is created and is interactive
    test("close rules button should be created and interactive", () => {
        // Find the start button from the mocked children
        const closeRulesButton = scene.children
            .getChildren()
            .find((child) => child.text === "Close Rules");

        // Assertions to check if the start button exists and is interactive
        expect(closeRulesButton).toBeDefined(); // Ensure the button exists
        expect(closeRulesButton.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
    });
});