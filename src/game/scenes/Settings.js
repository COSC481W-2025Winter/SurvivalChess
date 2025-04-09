import Phaser from "phaser";
import {COLOR_THEMES} from "../../game-objects/constants.js";
import {EventBus} from "../EventBus";
import {setPieceStyle} from "./PieceStyle";
import {toggleDev, DevButtons, DEV_MODE} from "../../game-objects/dev-buttons.js";
import {ChessTiles} from "../../game-objects/chess-tiles";

export class Settings extends Phaser.Scene {
	constructor() {
		super({key: "Settings"});
	}

	preload() {
		this.load.setPath("assets");
		this.load.image("option1", "pieceOption1.png");
		this.load.image("option2", "pieceOption2.png");
	}

	create() {
		this.option1 = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 3 - 30, "option1");
		this.option2 = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 3 + 30, "option2");

		this.option1
			.setOrigin(0.5)
			.setDepth(100)
			.setInteractive()
			.on("pointerover", () => {
				this.option1.setScale(1.2); // Increase the scale
			})
			.on("pointerout", () => {
				this.option1.setScale(1); // Reset to original size
			})
			.on(
				"pointerdown",
				function () {
					setPieceStyle(1);
				},
				this
			);

		this.option2
			.setOrigin(0.5)
			.setDepth(100)
			.setInteractive()
			.on("pointerover", () => {
				this.option2.setScale(1.2); // Increase the scale
			})
			.on("pointerout", () => {
				this.option2.setScale(1); // Reset to original size
			})
			.on(
				"pointerdown",
				function () {
					setPieceStyle(2);
				},
				this
			);

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

		// Piece style selection title
		this.add.text(this.cameras.main.width / 2.2, 170, "Piece Style:", {fontSize: "20px", fill: "#fff"});

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

					// Refresh the board and captured panel live
					const gameScene = this.scene.get("Game");
					if (gameScene?.chessTiles?.updateColorTheme) {
						gameScene.chessTiles.updateColorTheme(palette);
					}

					// Call the change background method of the Game scene
					if (this.scene.get("MainGame")) {
						const maingameScene = this.scene.get("MainGame");
						maingameScene.changeBackground();
					}

					EventBus.emit("PaletteChanged", palette);
					this.scene.stop("Settings"); // Optional: update Settings screen UI
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
