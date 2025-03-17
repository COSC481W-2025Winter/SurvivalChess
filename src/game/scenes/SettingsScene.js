import { Scene } from "phaser";
import { COLOR_THEMES } from "../../game-objects/constants.js";

export class SettingsScene extends Scene {
    constructor() {
        super({ key: "SettingsScene" });
    }

    create() {
        console.log("Settings Scene Loaded!");

        this.add.text(100, 50, "Settings", { fontSize: "32px", fill: "#fff" });

        // 🎨 Color Palette Selection
        this.add.text(100, 150, "Color Palette:", { fontSize: "20px", fill: "#fff" });

        const palettes = ["default", "dark", "light"];
        let yOffset = 200;

        palettes.forEach((palette) => {
            this.add.text(120, yOffset, palette, { fontSize: "18px", fill: "#aaa" })
                .setInteractive()
                .on("pointerdown", () => {
                    localStorage.setItem("selectedPalette", palette);
                    this.applyColorTheme(palette);
                });
            yOffset += 40;
        });

        // 🛠 Dev Mode Toggle
        this.add.text(100, yOffset + 20, "Dev Mode:", { fontSize: "20px", fill: "#fff" });

        this.devModeText = this.add.text(200, yOffset + 20, "OFF", {
            fontSize: "20px",
            fill: "#f00"
        })
        .setInteractive()
        .on("pointerdown", () => {
            const isEnabled = this.devModeText.text === "OFF";
            this.devModeText.setText(isEnabled ? "ON" : "OFF").setFill(isEnabled ? "#0f0" : "#f00");
            localStorage.setItem("devMode", isEnabled);
        });

        // ❌ Close Button Fix
        this.add.text(400, 100, "Close", {
            fontSize: "24px",
            fill: "#f00",
            backgroundColor: "#333",
            padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .on("pointerdown", () => {
            console.log("Closing settings...");
            this.scene.stop("SettingsScene");
            this.scene.start("MainGame"); // ✅ Ensure correct scene name
        });

        // Apply stored settings
        const savedPalette = localStorage.getItem("selectedPalette") || "default";
        this.applyColorTheme(savedPalette);

        const devModeEnabled = localStorage.getItem("devMode") === "true";
        this.devModeText.setText(devModeEnabled ? "ON" : "OFF").setFill(devModeEnabled ? "#0f0" : "#f00");
    }

    applyColorTheme(selectedPalette) {
        const colors = COLOR_THEMES[selectedPalette];
        if (!colors) return;

        document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
        document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);

        console.log(`Color theme applied: ${selectedPalette}`);

        // Reload chess pieces with new color theme
        this.reloadChessPieces(selectedPalette);
    }

    reloadChessPieces(selectedPalette) {
        const colorPalettes = {
            default: "assets/drummyfishChess/",
            dark: "assets/ourChessPieces/",
            light: "assets/ourChessPieces/"
        };

        const newAssetPath = colorPalettes[selectedPalette];

        const pieceTypes = ["pawn", "rook", "knight", "bishop", "queen", "king"];
        const colorsAvailable = ["white", "black"];

        pieceTypes.forEach((piece) => {
            colorsAvailable.forEach((color) => {
                const key = `${piece}_${color}`;
                this.textures.remove(key); // Remove old texture
                this.load.image(key, `${newAssetPath}${key}.png`); // Load new one
            });
        });

        // ✅ Ensure loaded textures are updated on screen
        this.load.once("complete", () => {
            console.log("Textures updated, refreshing chess pieces...");
            this.children.each((child) => {
                if (child.texture && pieceTypes.includes(child.texture.key)) {
                    child.setTexture(child.texture.key);
                }
            });
        });

        this.load.start(); // Ensure Phaser loads new images
    }
}
