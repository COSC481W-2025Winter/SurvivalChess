import { Settings } from "./Settings"; // Import the Settings scene

describe("Settings Scene", () => {
    let scene;

    beforeEach(() => {
        scene = new Settings();

        // Mock Phaser dependencies
        scene.cameras = { main: { setBackgroundColor: jest.fn() } };
        scene.children = { getChildren: jest.fn().mockReturnValue([]) };
        scene.scene = { stop: jest.fn(), restart: jest.fn() };

        scene.add = {
            text: jest.fn().mockReturnValue({
                setOrigin: jest.fn(),
                setDepth: jest.fn(),
                setInteractive: jest.fn(),
                on: jest.fn(),
                setText: jest.fn(),
            }),
            rectangle: jest.fn().mockReturnValue({ setDepth: jest.fn() }),
        };

        scene.create(); // Simulate scene creation
    });

    test("should create the Settings title", () => {
        expect(scene.add.text).toHaveBeenCalledWith(
            150, 50, "SETTINGS", expect.objectContaining({ fontSize: "32px" })
        );
    });

    test("should create the Close button", () => {
        expect(scene.add.text).toHaveBeenCalledWith(
            400, 100, "Close", expect.objectContaining({ fontSize: "24px", fill: "#f00" })
        );
    });

    test("should make the Close button interactive", () => {
        const closeButton = scene.add.text.mock.results.find(result =>
            result.value.text === "Close"
        ).value;

        expect(closeButton.setInteractive).toHaveBeenCalled();
        expect(closeButton.on).toHaveBeenCalledWith("pointerdown", expect.any(Function));
    });

    test("should create Developer Mode button", () => {
        expect(scene.add.text).toHaveBeenCalledWith(
            625, 550, "Developer Mode: OFF", expect.objectContaining({ fill: "#ffffff" })
        );
    });

    test("should create theme selection buttons", () => {
        const palettes = ["default", "dark", "light"];
        let yOffset = 200;

        palettes.forEach((palette) => {
            expect(scene.add.text).toHaveBeenCalledWith(
                120, yOffset, palette, expect.objectContaining({ fontSize: "18px" })
            );
            yOffset += 50;
        });
    });
});
