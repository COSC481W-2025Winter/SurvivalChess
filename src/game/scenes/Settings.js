import Phaser from "phaser";
import {COLOR_THEMES} from "../../game-objects/constants.js";

export class Settings extends Phaser.Scene {
	constructor() {
		super({key: "Settings"});
	}

	preload() {
		this.load.setPath("assets");
		this.load.image("star", "star.png");
		this.load.image("background", "bg.png");

		WebFont.load({
			google: {
				families: ["Pixelify Sans"],
			},
			active: () => {
				this.fontLoaded = true;
			},
		});
	}

	create() {
		if (!this.fontLoaded) {
			this.time.delayedCall(100, () => this.create(), [], this);
			return;
		}

		const centerX = this.cameras.main.width / 2;
		const centerY = this.cameras.main.height / 2;

		// Dimmed background overlay
		const bg = this.add.rectangle(centerX, centerY, 1250, 768, 0x000000, 0.5);
		bg.setDepth(50);

		// Settings box
		const square = this.add.rectangle(centerX, centerY, 800, 400, 0x333333, 0.9);
		square.setDepth(51);

		// Title text
		this.add
			.text(centerX, centerY - 140, "Settings", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: "38px",
				color: "#f28d3e",
				stroke: "#000000",
				strokeThickness: 5,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		// Section label (further moved left)
		this.add
			.text(centerX - 350, centerY - 60, "Color Palette:", {
				fontSize: "20px",
				fill: TEXT_COLOR, // Use TEXT_COLOR constant
				fontFamily: "Pixelify Sans",
			})
			.setDepth(100);

		// Palette options (further moved left)
		const palettes = ["default", "dark", "light"];
		let yOffset = centerY - 10;

		palettes.forEach((palette) => {
			this.add
				.text(centerX - 350, yOffset, palette, {
					fontFamily: "'Pixelify Sans', sans-serif",
					fontSize: "18px",
					color: "#f28d3e", // White text color
					backgroundColor: BACKGROUND_COLOR, // Use BACKGROUND_COLOR constant

					stroke: STROKE_COLOR, // Use STROKE_COLOR constant

					align: "center",
				})
				.setDepth(100)
				.setInteractive()
				.on("pointerdown", () => {
					localStorage.setItem("selectedPalette", palette);
					this.applyColorTheme(palette);
					this.updateChessPieceMode(palette);
					this.scene.restart();
				});

			yOffset += 50;
		});

		// Dev Mode Toggle Button
		// this.add
		//   .text(200, yOffset, "Toggle Dev Mode", {
		//     fontSize: "18px",
		//     fill: "#f28d3e",
		//     backgroundColor: "#333",
		//     padding: { x: 10, y: 5 },
		//   })
		//   .setInteractive()
		//   .on("pointerdown", () => {
		//     toggleDev();
		//   });

		// yOffset += 50;

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
			.on(
				"pointerdown",
				() => {
					this.scene.stop("Settings");
				},
				this
			);
		closeButton.setDepth(100);

		// Close settings by clicking background or box
		bg.setInteractive();
		square.setInteractive();

		bg.on("pointerdown", () => {
			this.scene.stop("Settings");
		});

		square.on("pointerdown", (pointer) => {
			pointer.event.stopPropagation(); // Prevent background click through
		});

		// Apply previously selected color palette
		const savedPalette = localStorage.getItem("selectedPalette") || "default";
		this.applyColorTheme(savedPalette);
	}

	applyColorTheme(selectedPalette) {
		const colors = COLOR_THEMES[selectedPalette];
		if (!colors) return;

		document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
		document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);
	}

	updateChessPieceMode(selectedPalette) {
		localStorage.setItem("mode", selectedPalette);
		window.dispatchEvent(new Event("storage"));
	}
}
