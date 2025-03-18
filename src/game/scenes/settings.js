import Phaser from "phaser"; // ✅ Ensure Phaser is imported
import {COLOR_THEMES} from "../../game-objects/constants.js";

export class Settings extends Phaser.Scene {
	constructor() {
		super({key: "Settings"});
	}

	create() {
		// console.log("Settings Scene Loaded!"); // ❌ Removed to avoid 'no-console'

		this.cameras.main.setBackgroundColor("#d87b40"); // Match Rules page

		this.add.text(150, 50, "SETTINGS", {
			fontSize: "32px",
			fill: "#fff",
			fontFamily: "Press Start 2P",
		});

		// 🎨 Theme Selection
		this.add.text(100, 150, "Color Palette:", {fontSize: "20px", fill: "#fff"});

		const palettes = ["default", "dark", "light"];
		let yOffset = 200;

		palettes.forEach((palette) => {
			this.add
				.text(120, yOffset, palette, {
					fontSize: "18px",
					fill: "#aaa",
					backgroundColor: "#333",
					padding: {x: 10, y: 5},
				})
				.setInteractive()
				.on("pointerdown", () => {
					// console.log(`Applying color theme: ${palette}`); // ❌ Removed 'no-console'
					localStorage.setItem("selectedPalette", palette);
					this.applyColorTheme(palette);
					this.scene.restart(); // 🔄 Refresh
				});

			yOffset += 50;
		});

		// ❌ Close Button
		this.add
			.text(400, 100, "Close", {
				fontSize: "24px",
				fill: "#f00",
				backgroundColor: "#333",
				padding: {x: 10, y: 5},
			})
			.setInteractive()
			.on("pointerdown", () => {
				// console.log("Closing settings..."); // ❌ Removed 'no-console'
				this.scene.stop("Settings");
				//	this.scene.start("MainGame");
			});

		// Apply stored settings
		const savedPalette = localStorage.getItem("selectedPalette") || "default";
		this.applyColorTheme(savedPalette);
	}

	applyColorTheme(selectedPalette) {
		const colors = COLOR_THEMES[selectedPalette];

		if (!colors) {
			return; // ✅ Now properly wrapped in curly braces
		}

		document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
		document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);

		// console.log(`Color theme applied: ${selectedPalette}`); // ❌ Removed 'no-console'
	}
}
