import Phaser from "phaser";
import {COLOR_THEMES} from "../../game-objects/constants.js";
import {toggleDev, DEV_MODE} from "../../game-objects/dev-buttons.js";

export class Settings extends Phaser.Scene {
	constructor() {
		super({key: "Settings"});
	}

	create() {
		// Semi-transparent overlay background
		const overlay = this.add.rectangle(
			this.cameras.main.width / 2,
			this.cameras.main.height / 2,
			this.cameras.main.width * 0.8,
			this.cameras.main.height * 0.7,
			0x000000,
			0.7 // Transparency level
		);
		overlay.setOrigin(0.5, 0.5);

		// SETTINGS Title
		this.add
			.text(this.cameras.main.width / 2, 100, "SETTINGS", {
				fontSize: "32px",
				fill: "#f28d3e",
				fontFamily: "Press Start 2P",
			})
			.setOrigin(0.5);

		// Color Palette Section
		this.add.text(200, 170, "Color Palette:", {fontSize: "20px", fill: "#fff"});

		const palettes = ["default", "dark", "light"];
		let yOffset = 220;

		palettes.forEach((palette) => {
			this.add
				.text(220, yOffset, palette, {
					fontSize: "18px",
					fill: "#f28d3e",
					backgroundColor: "#333",
					padding: {x: 10, y: 5},
				})
				.setInteractive()
				.on("pointerdown", () => {
					localStorage.setItem("selectedPalette", palette);
					this.applyColorTheme(palette);
					this.scene.restart(); // Refresh scene
				});

			yOffset += 50;
		});

		// Dev Mode Toggle Button
		this.devButton = this.add
			.text(200, yOffset, "Dev Mode: " + (DEV_MODE ? "ON" : "OFF"), {
				fontSize: "18px",
				fill: "#f28d3e",
				backgroundColor: "#333",
				padding: {x: 10, y: 5},
			})
			.setInteractive()
			.on("pointerdown", () => {
				console.log("Dev button clicked");
				toggleDev();
				this.devButton.setText("Dev Mode: " + (DEV_MODE ? "ON" : "OFF"));
			});

		// Close Button (Same Style as "Close Rules")
		this.add
			.text(this.cameras.main.width / 2, this.cameras.main.height - 100, "Close Settings", {
				fontSize: "20px",
				fill: "#fff",
				backgroundColor: "#f28d3e",
				padding: {x: 20, y: 10},
			})
			.setOrigin(0.5)
			.setInteractive()
			.on("pointerdown", () => {
				this.scene.stop("Settings");
			});

		// Apply stored settings
		const savedPalette = localStorage.getItem("selectedPalette") || "default";
		this.applyColorTheme(savedPalette);
	}

	applyColorTheme(selectedPalette) {
		const colors = COLOR_THEMES[selectedPalette];

		if (!colors) {
			return;
		}

		document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
		document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);
	}
}
