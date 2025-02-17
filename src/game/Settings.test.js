import { Settings } from "../scenes/Settings"; // Adjust path if needed
import { EventBus } from "../EventBus";

jest.mock("../EventBus", () => ({
    EventBus: { emit: jest.fn() } // Mock EventBus to prevent actual event firing
}));

describe("Settings Scene", () => {
    let settingsScene;

    beforeEach(() => {
        settingsScene = new Settings();
        settingsScene.scene = { stop: jest.fn(), start: jest.fn() }; // Mock scene functions
        settingsScene.add = {
            image: jest.fn(() => ({ alpha: 1, setDepth: jest.fn() })), // Mock image
            text: jest.fn(() => ({ setOrigin: jest.fn(), setDepth: jest.fn(), setInteractive: jest.fn(), on: jest.fn() })) // Mock text elements
        };
        settingsScene.load = { setPath: jest.fn(), image: jest.fn() }; // Mock asset loading
    });

    test("should preload assets correctly", () => {
        settingsScene.preload();
        expect(settingsScene.load.setPath).toHaveBeenCalledWith("assets");
        expect(settingsScene.load.image).toHaveBeenCalledWith("star", "star.png");
        expect(settingsScene.load.image).toHaveBeenCalledWith("background", "bg.png");
    });

    test("should create UI elements", () => {
        settingsScene.create();

        expect(settingsScene.add.image).toHaveBeenCalledWith(512, 384, "background");
        expect(settingsScene.add.image).toHaveBeenCalledWith(512, 350, "star");
        expect(settingsScene.add.text).toHaveBeenCalledWith(
            512, 490, "Settings mode",
            expect.objectContaining({ fontSize: 38, color: "#ffffff" })
        );
    });

    test("should create and handle Close Settings button", () => {
        const mockButton = { setPosition: jest.fn(), setInteractive: jest.fn(), on: jest.fn() };
        settingsScene.add.text.mockReturnValue(mockButton); // Mock button behavior

        settingsScene.create();

        expect(settingsScene.add.text).toHaveBeenCalledWith(
            100, 100, "Close Settings",
            expect.objectContaining({ fill: "#0099ff" })
        );
        expect(mockButton.setPosition).toHaveBeenCalledWith(800, 50);
        expect(mockButton.setInteractive).toHaveBeenCalled();

        // Check button click event
        const pointerdownCallback = mockButton.on.mock.calls.find(call => call[0] === "pointerdown")[1];
        pointerdownCallback.call(settingsScene); // Simulate button click

        expect(settingsScene.scene.stop).toHaveBeenCalledWith("Settings"); // Ensure scene stops
        expect(settingsScene.scene.start).toHaveBeenCalledWith("MainMenu"); // Ensure transition to main menu
    });

    test("should emit an event when the scene is ready", () => {
        settingsScene.create();
        expect(EventBus.emit).toHaveBeenCalledWith("current-scene-ready", settingsScene);
    });
});
