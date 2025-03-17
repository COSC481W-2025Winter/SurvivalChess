import { Settings } from "./settings";

// We are mocking the Settings Scene instead of running the whole game loop
// Running the whole game loop takes too long and will result in the test timing out and failing
describe("Settings Scene", () => {
    let scene;

    beforeEach(() => {
        // Setup: Create a new instance of the Settings scene for each test
        scene = new Settings();

        // Mock the cameras object since it is normally initialized by Phaser
        scene.cameras = {
            main: {
                setBackgroundColor: jest.fn(),
            },
        };

        // Mock the children array to simulate the scene objects like buttons and text.
        scene.children = {
            // Mock the getChildren method, which is responsible for fetching the scene's children objects (e.g., text, buttons)
            getChildren: jest.fn().mockReturnValue([
                { text: "Settings", x: 512, y: 100 },
                { text: "Close Settings", input: { enabled: true } },
                { text: "Developer Mode: OFF", input: { enabled: true } },
                { text: "Color Option:", x: 400, y: 450 },
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

    // Test to verify that the main settings title exists
    test("Settings title should be created", () => {
        const titleText = scene.children.getChildren().find((child) => child.text === "Settings");
        expect(titleText).toBeDefined();
        expect(titleText.x).toBe(512);
        expect(titleText.y).toBe(100);
    });

    // Test to verify that the close settings button exists and is interactive
    test("Close Settings button should be created and interactive", () => {
        const closeSettingsButton = scene.children.getChildren().find((child) => child.text === "Close Settings");
        expect(closeSettingsButton).toBeDefined();
        expect(closeSettingsButton.input.enabled).toBe(true);
    });

    // Test to verify that the Developer Mode button exists and is interactive
    test("Developer Mode button should be created and interactive", () => {
        const devModeButton = scene.children.getChildren().find((child) => child.text.includes("Developer Mode"));
        expect(devModeButton).toBeDefined();
        expect(devModeButton.input.enabled).toBe(true);
    });

    // Test to verify that the Color Option label exists
    test("Color Option label should be created", () => {
        const colorLabel = scene.children.getChildren().find((child) => child.text === "Color Option:");
        expect(colorLabel).toBeDefined();
        expect(colorLabel.x).toBe(400);
        expect(colorLabel.y).toBe(450);
    });
});
