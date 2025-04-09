import Phaser from "phaser";
import {COLOR_THEMES} from "../../game-objects/constants.js";
import {toggleDev, DevButtons, DEV_MODE} from "../../game-objects/dev-buttons.js";
import {ChessTiles} from "../../game-objects/chess-tiles";
import WebFont from "webfontloader";
// import { ChessPiece } from "../../game-objects/chess-piece";

import {
	RULES_BACKGROUND_COLOR,
	RULES_TEXT_ONE,
	RULES_TEXT_TWO,
	RULES_BACKGROUND_COLOR_TWO,
	RULES_TEXT_THREE,
} from "../../game-objects/constants";

export class Settings extends Phaser.Scene {
	constructor() {
		super({key: "Settings"});
	}

	preload() {
		this.load.setPath("assets");
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

		this.scene.moveAbove("MainGame", "Settings");

		// Background blocker
		this.bg = this.add.rectangle(1, 1, 1, 1, RULES_BACKGROUND_COLOR, 0.5).setDepth(50);

		// Semi-transparent overlay
		const overlayWidth = this.cameras.main.width * 0.8;
		const overlayHeight = this.cameras.main.height * 0.7;
		const overlay = this.add
			.rectangle(
				this.cameras.main.width / 2,
				this.cameras.main.height / 2,
				overlayWidth,
				overlayHeight,
				RULES_BACKGROUND_COLOR_TWO,
				0.9
			)
			.setOrigin(0.5)
			.setDepth(50);

		// Transparent blocker to prevent interaction with scenes underneath
		const blocker = this.add
			.rectangle(
				this.cameras.main.width / 2,
				this.cameras.main.height / 2,
				this.cameras.main.width,
				this.cameras.main.height,
				0x000000,
				0
			)
			.setDepth(50)
			.setInteractive();

		blocker.on("pointerdown", () => {});

		// Title
		this.titleText = this.add
			.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 400, "Settings", {
				fontFamily: "'Pixelify Sans', sans-serif",
				color: RULES_TEXT_TWO,
				stroke: RULES_TEXT_ONE,
				fontSize: "80px",
				strokeThickness: 6,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		// Color Palette Section
		this.add
			.text(overlay.x - overlayWidth / 2 + 20, overlay.y - overlayHeight / 2 + 200, "Color Palette:", {
				fontSize: "90px",
				fill: RULES_TEXT_TWO,
				fontFamily: "'Pixelify Sans', sans-serif",
			})
			.setDepth(100);

		const palettes = ["default", "dark", "light"];
		let yOffset = overlay.y - overlayHeight / 2 + 200;

		palettes.forEach((palette) => {
			this.add
				.text(overlay.x - overlayWidth / 2 + 20, yOffset + 300, palette, {
					fontSize1: "90px",
					fill: RULES_TEXT_TWO,
					stroke: RULES_TEXT_ONE,
					//  backgroundColor: "#333",
					padding: {x: 15, y: 10},
					fontFamily: "'Pixelify Sans', sans-serif",
					//  stroke: "#f28d3e",
					fontSize: "70px",
					strokeThickness: 2,
				})
				.setDepth(100)
				.setInteractive()
				.on("pointerdown", () => {
					localStorage.setItem("selectedPalette", palette);
					this.applyColorTheme(palette);
					this.scene.restart();
				});

			yOffset += 60;
		});

		// Dev Mode Toggle
		this.devButton = this.add
			.text(overlay.x - overlayWidth / 2 + 20, yOffset + 50, "Dev Mode: " + (DEV_MODE ? "ON" : "OFF"), {
				fontFamily: "'Pixelify Sans', sans-serif",
				color: RULES_TEXT_TWO,
				stroke: RULES_TEXT_ONE,
				fontSize: "70px",
				strokeThickness: 2,
			})
			.setDepth(100)
			.setInteractive()
			.on("pointerdown", () => {
				const mainGameScene = this.scene.get("MainGame");

				if (!mainGameScene) {
					console.warn("MainGame scene not found.");
					return;
				}

				const newDevState = toggleDev();

				if (newDevState) {
					console.log("DEV_MODE is ON");
					if (!this.devButtons) {
						this.devButtons = new DevButtons(mainGameScene, ChessTiles);
						this.devButtons.getNondevButtons().forEach((button) => {
							button.setDepth(110); // Put above everything
							button.visible = true;
						});
					}
				} else {
					console.log("DEV_MODE is OFF");
					if (this.devButtons) {
						this.devButtons.getNondevButtons().forEach((button) => {
							button.visible = false;
						});
					}
				}

				this.devButton.setText("Dev Mode: " + (newDevState ? "ON" : "OFF"));
			});

		yOffset += 50;

		// Close Button: Stops the Settings Scene
		this.closeButton = this.add
			.text(this.cameras.main.width / 2, this.cameras.main.height - 30, "Close Settings", {
				fontFamily: "'Pixelify Sans', sans-serif",
				backgroundColor: RULES_TEXT_THREE,
				color: RULES_TEXT_TWO,
				stroke: RULES_TEXT_ONE,
				strokeThickness: 2,
				fontSize: "50px", // Increased font size
				padding: {x: 50, y: 20}, // Increased padding
			})
			.setOrigin(0.5)
			.setInteractive()
			.setDepth(9999) // Ensure it's on top
			.setAlpha(1); // Ensure visibility

		this.closeButton.on("pointerdown", () => {
			console.log("Closing Settings scene...");
			this.scene.stop("Settings");
			this.scene.start("MainGame");
		});

		// Optional: Apply saved theme
		const savedPalette = localStorage.getItem("selectedPalette") || "default";
		this.applyColorTheme(savedPalette);
	}

	applyColorTheme(selectedPalette) {
		const colors = COLOR_THEMES[selectedPalette];
		if (!colors) return;

		document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
		document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);
	}
}
