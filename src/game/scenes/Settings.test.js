import { Settings } from "./Settings"; // Import the Settings scene

describe("Settings Scene", () => {
    let scene;

    beforeEach(() => {
        scene = new Settings();

        // Mock Phaser dependencies
        scene.cameras = { main: { setBackgroundColor: jest.fn() } };
        scene.scene = { stop: jest.fn(), restart: jest.fn() };

        // ✅ Properly mock Phaser’s `this.add.text()` method, ensuring `.setInteractive()` and `.on()` are available
        scene.add = {
            text: jest.fn((x, y, text, style) => {
                const mockTextObject = {
                    x,
                    y,
                    text,
                    style,
                    setInteractive: jest.fn().mockReturnThis(), // Ensure method chaining works
                    on: jest.fn().mockReturnThis(), // Ensure event listeners are tracked
                    setOrigin: jest.fn().mockReturnThis(),
                    setDepth: jest.fn().mockReturnThis(),
                };
                return mockTextObject;
            }),
        };

        scene.create(); // Simulate scene creation
    });

    test("should create the Settings title", () => {
        expect(scene.add.text).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), "SETTINGS", expect.any(Object));
    });

    test("should create the Close button", () => {
        expect(scene.add.text).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), "Close", expect.any(Object));
    });

    test("should make the Close button interactive", () => {
        // ✅ Find the Close button in the mock
        const closeButton = scene.add.text.mock.results.find(result => result.value.text === "Close")?.value;

        expect(closeButton).toBeDefined(); // Ensure the button exists
        expect(closeButton.setInteractive).toHaveBeenCalled(); // Check if interactive
        expect(closeButton.on).toHaveBeenCalledWith("pointerdown", expect.any(Function)); // Check click event
    });
});
