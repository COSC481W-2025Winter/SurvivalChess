import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Settings extends Scene {
    constructor() {
        super("Settings");
        this.currentTheme = "#ffc0cb"; // Default color (Pink)
        this.developerMode = false;
    }

    create() {
        // Background color based on the current theme
        const bg = this.add.rectangle(625, 384, 1250, 768, Phaser.Display.Color.HexStringToColor(this.currentTheme).color, 0.5);
        bg.setDepth(50);

        // Settings Title (Center-aligned)
        this.add
            .text(512, 100, "Settings", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Close Button (Center-aligned)
        const closeButton = this.add.text(625, 600, "Close Settings", {
            fill: "#0099ff",
            backgroundColor: "#ffffff",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setOrigin(0.5).setInteractive().setDepth(100);

        closeButton.on("pointerdown", () => this.scene.stop("Settings"));

        // Developer Mode Toggle Button
        this.devModeButton = this.add.text(625, 550, "Developer Mode: OFF", {
            fill: "#ffffff",
            backgroundColor: "#444444",
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }).setOrigin(0.5).setInteractive().setDepth(100);

        this.devModeButton.on("pointerdown", () => this.toggleDevMode());

        // Create a Color Palette Picker (Visible under Developer Mode)
        this.createColorPalette();

        // Update UI elements for the initial state
        this.updateTheme();
        this.updateDevMode();
    }

    // Create Color Palette for theme selection
    createColorPalette() {
        // Add a label for Color Option (under Developer Mode)
        const colorLabel = this.add.text(400, 450, "Color Option:", {
            fontFamily: "Arial",
            fontSize: 20,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 6,
            align: "center",
        }).setOrigin(0.5).setDepth(100);

        // Create a Color Picker
        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.value = this.currentTheme;
        colorPicker.style.position = "absolute";
        colorPicker.style.top = "50%";
        colorPicker.style.left = "50%";
        colorPicker.style.transform = "translate(-50%, -50%)";
        colorPicker.style.zIndex = "1000";

        document.body.appendChild(colorPicker);

        colorPicker.addEventListener("input", (event) => {
            this.currentTheme = event.target.value;
            this.updateTheme();
        });

        // Remove the color picker when settings are closed
        this.events.on("shutdown", () => {
            colorPicker.remove();
        });
    }

    updateTheme() {
        // Update the background color of the game scene
        this.cameras.main.setBackgroundColor(Phaser.Display.Color.HexStringToColor(this.currentTheme).color);
        console.log(`Theme changed to ${this.currentTheme}`);
    }

    toggleDevMode() {
        // Toggle Developer Mode (ON/OFF)
        this.developerMode = !this.developerMode;
        this.updateDevMode();
    }

    updateDevMode() {
        // Update the button text based on Developer Mode status
        this.devModeButton.setText(`Developer Mode: ${this.developerMode ? "ON" : "OFF"}`);
        console.log(`Developer Mode ${this.developerMode ? "Enabled" : "Disabled"}`);
    }
}
