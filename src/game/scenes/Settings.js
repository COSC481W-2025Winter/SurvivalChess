import Phaser from "phaser";
import {COLOR_THEMES} from "../../game-objects/constants.js";
import WebFont from "webfontloader";

// Define the color constants (can be moved to a separate constants file if preferred)
const TEXT_COLOR = "#f28d3e"; // Text color
const BACKGROUND_COLOR = "#444"; // Background color
const STROKE_COLOR = "#000000"; // Stroke color

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

		// Close button with color constants applied
		const closeButton = this.add.text(625, 625, "Close Settings", {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 25,
			backgroundColor: BACKGROUND_COLOR, // Use BACKGROUND_COLOR constant
			color: TEXT_COLOR, // Use TEXT_COLOR constant
			stroke: STROKE_COLOR, // Use STROKE_COLOR constant
			strokeThickness: 5,
			padding: {left: 20, right: 20, top: 10, bottom: 10},
		});
		closeButton.setOrigin(0.5);
		closeButton.setInteractive();
		closeButton.on(
			"pointerdown",
			function () {
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
