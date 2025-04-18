import Phaser from "phaser";
import {Scene} from "phaser";
import {COLOR_THEMES} from "../../game-objects/constants.js";
import {EventBus} from "../EventBus";
import {setPieceStyle} from "./PieceStyle";
import {toggleDev, DEV_MODE} from "../../game-objects/dev-buttons.js";
// import {ChessTiles} from "../../game-objects/chess-tiles";
import {globalMuteSound, toggleGlobalMute} from "../../game-objects/global-stats.js";
import {
	paddingTexts,
	fontsizeTexts,
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	CENTER_WIDTH,
	CENTER_HEIGHT,
	DOZEN_WIDTH,
	DOZEN_HEIGHT,
	UNIT_HEIGHT,
} from "../../game-objects/constants";

const palettes = ["default", "dark", "light"];

export class Settings extends Scene {
	bg;
	square;
	titleText;
	closeButton;
	originalSizing;
	scaleChange;

	constructor() {
		super("Settings");
	}

	preload() {
		this.load.setPath("assets");
		this.load.image("option1", "pieceOption1.png");
		this.load.image("option2", "pieceOption2.png");
		this.originalSizing = 750;
	}

	create() {
		const selectedPalette = localStorage.getItem("selectedPalette") || "default";

		const themeColors = {
			default: {
				fill: 0xe5aa70,
				stroke: 0xc04000,
				bgOpacity: 0.3,
				panelOpacity: 0.9,
			},
			dark: {
				fill: 0xbbb8b1,
				stroke: 0x222222,
				bgOpacity: 0.4,
				panelOpacity: 0.9,
			},
			light: {
				fill: 0x3b3b3b,
				stroke: 0xffffff,
				bgOpacity: 0.2, // reduced opacity for light mode
				panelOpacity: 0.8,
			},
		}[selectedPalette];

		const fillColor = Phaser.Display.Color.IntegerToColor(themeColors.fill).rgba;
		const strokeColor = Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba;

		this.scene.moveAbove("MainGame", "Settings");

		this.bg = this.add.rectangle(0, 0, 0, 0, themeColors.stroke, themeColors.bgOpacity);
		this.bg.setDepth(50);

		this.square = this.add.rectangle(0, 0, 0, 0, 0xffffff, themeColors.panelOpacity);
		this.square.setDepth(50);

		this.titleText = this.add
			.text(0, 0, "Settings", {
				fontFamily: "'Pixelify Sans', sans-serif",
				color: fillColor,
				stroke: strokeColor,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		// desktop format
		if (this.cameras.main.height < this.cameras.main.width) {
			this.option1 = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 3.3, "option1");
			this.option2 = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2.7, "option2");

			this.option1
				.setOrigin(0.5)
				.setDepth(100)
				.setInteractive()
				.on("pointerover", () => {
					this.option1.setScale(this.cameras.main.height / this.originalSizing + 0.2); // Increase the scale
				})
				.on("pointerout", () => {
					this.option1.setScale(this.cameras.main.height / this.originalSizing - 0.1); // Reset to original size
				})
				.on(
					"pointerdown",
					function () {
						setPieceStyle(1);
						this.scene.stop("Settings");
					},
					this
				);

			this.option2
				.setOrigin(0.5)
				.setDepth(100)
				.setInteractive()
				.on("pointerover", () => {
					this.option2.setScale(this.cameras.main.height / this.originalSizing + 0.2); // Increase the scale
				})
				.on("pointerout", () => {
					this.option2.setScale(this.cameras.main.height / this.originalSizing - 0.1); // Reset to original size
				})
				.on(
					"pointerdown",
					function () {
						setPieceStyle(2);
						this.scene.stop("Settings");
					},
					this
				);

			// Piece style selection title
			this.pieceStyleSelectionTileText = this.add
				.text(this.cameras.main.width / 2.15, this.cameras.main.height / 4.5, "Piece Style:", {
					fontFamily: "'Pixelify Sans', sans-serif",
					color: fillColor,
				})
				.setDepth(100);

			// Color Palette Section
			this.colorPaletteSectionText = this.add
				.text(this.cameras.main.width / 8, this.cameras.main.height / 4.5, "Color Palette:", {
					fontFamily: "'Pixelify Sans', sans-serif",
					color: fillColor,
				})
				.setDepth(100);

			this.paletteButtons = {};
			let yOffset = 0;

			palettes.forEach((palette) => {
				this.paletteButtons[palette] = this.add
					.text(this.cameras.main.width / 8, this.cameras.main.width / 2 + yOffset, palette, {
						fontFamily: "'Pixelify Sans', sans-serif",
						color: fillColor,
						fontSize: "18px",
						backgroundColor: strokeColor,
						padding: {x: 10, y: 5},
					})
					.setDepth(100)
					.setInteractive()
					.on("pointerover", () => this.paletteButtons[palette].setScale(1.2))
					.on("pointerout", () => this.paletteButtons[palette].setScale(1))
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
				.text(
					this.cameras.main.width / 1.5,
					this.cameras.main.height / 3.75,
					"Dev Mode: " + (DEV_MODE ? "ON" : "OFF"),
					{
						fontFamily: "'Pixelify Sans', sans-serif",
						color: fillColor,
						fontSize: "18px",
						backgroundColor: strokeColor,
						padding: {x: 10, y: 5},
					}
				)
				.setDepth(100)
				.on("pointerover", () => this.devButton.setScale(1.2))
				.on("pointerout", () => this.devButton.setScale(1))
				.setInteractive()
				.on("pointerdown", () => {
					toggleDev();
					this.devButton.setText("Dev Mode: " + (DEV_MODE ? "ON" : "OFF"));
				});

			// Music Toggle Button
			this.muteButton = this.add
				.text(
					this.cameras.main.width / 1.5,
					this.cameras.main.height / 3.75 + 50,
					globalMuteSound ? "Unmute Music" : "Mute Music",
					{
						fontFamily: "'Pixelify Sans', sans-serif",
						color: fillColor,
						fontSize: "18px",
						backgroundColor: strokeColor,
						padding: {x: 10, y: 5},
					}
				)
				.setDepth(100)
				.on("pointerover", () => this.muteButton.setScale(1.2))
				.on("pointerout", () => this.muteButton.setScale(1))
				.setInteractive()
				.on("pointerdown", () => {
					toggleGlobalMute(this);
					this.muteButton.setText(globalMuteSound ? "Unmute Music" : "Mute Music");
				});

			this.closeButton = this.add
				.text(0, 0, "Close Settings", {
					fontFamily: "'Pixelify Sans', sans-serif",
					backgroundColor: "#ffffff", // always white panel
					color: fillColor,
					stroke: strokeColor,
				})
				.setDepth(100);
			this.closeButton.setOrigin(0.5);
			this.closeButton.setInteractive();
			this.closeButton.on("pointerdown", () => this.scene.stop("Settings"));
			this.closeButton.on("pointerover", () => this.closeButton.setScale(1.2));
			this.closeButton.on("pointerout", () => this.closeButton.setScale(1));
			this.closeButton.setDepth(100);

			// Apply stored settings
			const savedPalette = localStorage.getItem("selectedPalette") || "default";
			this.applyColorTheme(savedPalette);

			const scene = this;

			this.bg.setInteractive();
			this.square.setInteractive();

			window.addEventListener(
				"resize",
				function (event) {
					scene.resize();
				},
				false
			);

			this.resize();
			EventBus.emit("current-scene-ready", this);
		} else if (this.cameras.main.width < this.cameras.main.height) {
			// mobile version

			this.option1 = this.add.image(this.cameras.main.height / 2, this.cameras.main.width / 3.3, "option1");
			this.option2 = this.add.image(this.cameras.main.height / 2, this.cameras.main.width / 2.7, "option2");

			this.option1
				.setOrigin(0.5)
				.setDepth(100)
				.setInteractive()
				.on("pointerover", () => {
					this.option1.setScale(this.cameras.main.width / this.originalSizing + 0.2); // Increase the scale
				})
				.on("pointerout", () => {
					this.option1.setScale(this.cameras.main.width / this.originalSizing - 0.1); // Reset to original size
				})
				.on(
					"pointerdown",
					function () {
						setPieceStyle(1);
						this.scene.stop("Settings");
					},
					this
				);

			this.option2
				.setOrigin(0.5)
				.setDepth(100)
				.setInteractive()
				.on("pointerover", () => {
					this.option2.setScale(this.cameras.main.width / this.originalSizing + 0.2); // Increase the scale
				})
				.on("pointerout", () => {
					this.option2.setScale(this.cameras.main.width / this.originalSizing - 0.1); // Reset to original size
				})
				.on(
					"pointerdown",
					function () {
						setPieceStyle(2);
						this.scene.stop("Settings");
					},
					this
				);

			// Piece style selection title
			this.pieceStyleSelectionTileText = this.add
				.text(this.cameras.main.height / 2.15, this.cameras.main.width / 4.5, "Piece Style:", {
					fontFamily: "'Pixelify Sans', sans-serif",
					color: fillColor,
				})
				.setDepth(100);

			// Color Palette Section
			this.colorPaletteSectionText = this.add
				.text(this.cameras.main.height / 8, this.cameras.main.width / 4.5, "Color Palette:", {
					fontFamily: "'Pixelify Sans', sans-serif",
					color: fillColor,
				})
				.setDepth(100);

			this.paletteButtons = {};
			let yOffset = 0;

			palettes.forEach((palette) => {
				this.paletteButtons[palette] = this.add
					.text(this.cameras.main.height / 8, this.cameras.main.height / 2 + yOffset, palette, {
						fontFamily: "'Pixelify Sans', sans-serif",
						color: fillColor,
						fontSize: "18px",
						backgroundColor: strokeColor,
						padding: {x: 10, y: 5},
					})
					.setDepth(100)
					.setInteractive()
					.on("pointerover", () => this.paletteButtons[palette].setScale(1.2))
					.on("pointerout", () => this.paletteButtons[palette].setScale(1))
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
				.text(
					this.cameras.main.height / 1.5,
					this.cameras.main.width / 3.75,
					"Dev Mode: " + (DEV_MODE ? "ON" : "OFF"),
					{
						fontFamily: "'Pixelify Sans', sans-serif",
						color: fillColor,
						fontSize: "18px",
						backgroundColor: strokeColor,
						padding: {x: 10, y: 5},
					}
				)
				.setDepth(100)
				.on("pointerover", () => this.devButton.setScale(1.2))
				.on("pointerout", () => this.devButton.setScale(1))
				.setInteractive()
				.on("pointerdown", () => {
					toggleDev();
					this.devButton.setText("Dev Mode: " + (DEV_MODE ? "ON" : "OFF"));
				});

			// Music Toggle Button
			this.muteButton = this.add
				.text(
					this.cameras.main.height / 1.5,
					this.cameras.main.width / 3.75 + 50,
					globalMuteSound ? "Unmute Music" : "Mute Music",
					{
						fontFamily: "'Pixelify Sans', sans-serif",
						color: fillColor,
						fontSize: "18px",
						backgroundColor: strokeColor,
						padding: {x: 10, y: 5},
					}
				)
				.setDepth(100)
				.on("pointerover", () => this.muteButton.setScale(1.2))
				.on("pointerout", () => this.muteButton.setScale(1))
				.setInteractive()
				.on("pointerdown", () => {
					toggleGlobalMute(this);
					this.muteButton.setText(globalMuteSound ? "Unmute Music" : "Mute Music");
				});

			this.closeButton = this.add
				.text(0, 0, "Close Settings", {
					fontFamily: "'Pixelify Sans', sans-serif",
					backgroundColor: "#ffffff", // always white panel
					color: fillColor,
					stroke: strokeColor,
				})
				.setDepth(100);
			this.closeButton.setOrigin(0.5);
			this.closeButton.setInteractive();
			this.closeButton.on("pointerdown", () => this.scene.stop("Settings"));
			this.closeButton.on("pointerover", () => this.closeButton.setScale(1.2));
			this.closeButton.on("pointerout", () => this.closeButton.setScale(1));
			this.closeButton.setDepth(100);

			// Apply stored settings
			const savedPalette = localStorage.getItem("selectedPalette") || "default";
			this.applyColorTheme(savedPalette);

			const scene = this;

			this.bg.setInteractive();
			this.square.setInteractive();

			window.addEventListener(
				"resize",
				function (event) {
					scene.resize();
				},
				false
			);

			this.resize();
			EventBus.emit("current-scene-ready", this);
		}
	}

	applyColorTheme(selectedPalette) {
		const colors = COLOR_THEMES[selectedPalette];

		if (!colors) {
			return;
		}

		document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
		document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);
	}

	resize() {
		var width = this.cameras.main.width;
		var height = this.cameras.main.height;

		// desktop
		if (this.cameras.main.height < this.cameras.main.width) {
			this.option1.setPosition(width / 2.15, height / 3.3);
			this.option2.setPosition(width / 2.15, height / 2.65);
			this.option1.setScale(height / this.originalSizing - 0.1);
			this.option2.setScale(height / this.originalSizing - 0.1);

			this.pieceStyleSelectionTileText.setPosition(width / 2.25, height / 4.5);
			this.pieceStyleSelectionTileText.setFontSize(20);

			this.colorPaletteSectionText.setPosition(width / 8, height / 4.5);
			this.colorPaletteSectionText.setFontSize(20);

			let yOffset = 0;

			for (let palette of palettes) {
				this.paletteButtons[palette].setPosition(width / 8, height / 3.75 + yOffset);
				this.paletteButtons[palette].setFontSize(18);
				this.paletteButtons[palette].setPadding({x: 10, y: 5});
				fontsizeTexts(3 * UNIT_HEIGHT, this.paletteButtons[palette]);
				paddingTexts(2 * UNIT_HEIGHT, UNIT_HEIGHT, this.paletteButtons[palette]);

				yOffset += height / 18;
			}

			this.devButton.setFontSize(18);
			this.devButton.setPadding({x: 10, y: 5});
			this.devButton.setPosition(width / 1.5, height / 3.75);
			fontsizeTexts(3 * UNIT_HEIGHT, this.devButton);
			paddingTexts(2 * UNIT_HEIGHT, UNIT_HEIGHT, this.devButton);

			this.muteButton.setFontSize(18);
			this.muteButton.setPadding({x: 10, y: 5});
			this.muteButton.setPosition(width / 1.5, height / 3.75 + height / 18);
			fontsizeTexts(3 * UNIT_HEIGHT, this.muteButton);
			paddingTexts(2 * UNIT_HEIGHT, UNIT_HEIGHT, this.muteButton);

			this.bg.setPosition(CENTER_WIDTH, CENTER_HEIGHT);
			this.bg.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
			this.square.setPosition(CENTER_WIDTH, 5.5 * DOZEN_HEIGHT);
			this.square.setSize(10 * DOZEN_WIDTH, 9 * DOZEN_HEIGHT);
			this.titleText.setPosition(CENTER_WIDTH, 1.75 * DOZEN_HEIGHT);
			this.closeButton.setPosition(CENTER_WIDTH, 11 * DOZEN_HEIGHT);
			paddingTexts(4 * UNIT_HEIGHT, 2 * UNIT_HEIGHT, this.closeButton);
			fontsizeTexts(DOZEN_HEIGHT, this.titleText);
			fontsizeTexts(5 * UNIT_HEIGHT, this.pieceStyleSelectionTileText);
			fontsizeTexts(5 * UNIT_HEIGHT, this.colorPaletteSectionText);
			fontsizeTexts(9 * UNIT_HEIGHT, this.closeButton);
		} else if (this.cameras.main.height > this.cameras.main.width) {
			// mobile

			this.option1.setPosition(height / 2.15, width / 3.3);
			this.option2.setPosition(height / 2.15, width / 2.65);
			this.option1.setScale(width / this.originalSizing - 0.1);
			this.option2.setScale(width / this.originalSizing - 0.1);

			this.pieceStyleSelectionTileText.setPosition(height / 2.25, width / 4.5);
			this.pieceStyleSelectionTileText.setFontSize(20);

			this.colorPaletteSectionText.setPosition(height / 8, width / 4.5);
			this.colorPaletteSectionText.setFontSize(20);

			let yOffset = 0;

			for (let palette of palettes) {
				this.paletteButtons[palette].setPosition(height / 8, width / 3.75 + yOffset);
				this.paletteButtons[palette].setFontSize(18);
				this.paletteButtons[palette].setPadding({x: 10, y: 5});
				fontsizeTexts(3 * UNIT_HEIGHT, this.paletteButtons[palette]);
				paddingTexts(2 * UNIT_HEIGHT, UNIT_HEIGHT, this.paletteButtons[palette]);

				yOffset += width / 18;
			}

			this.devButton.setFontSize(18);
			this.devButton.setPadding({x: 10, y: 5});
			this.devButton.setPosition(height / 1.5, width / 3.75);
			fontsizeTexts(3 * UNIT_HEIGHT, this.devButton);
			paddingTexts(2 * UNIT_HEIGHT, UNIT_HEIGHT, this.devButton);

			this.muteButton.setFontSize(18);
			this.muteButton.setPadding({x: 10, y: 5});
			this.muteButton.setPosition(height / 1.5, width / 3.75 + width / 18);
			fontsizeTexts(3 * UNIT_HEIGHT, this.muteButton);
			paddingTexts(2 * UNIT_HEIGHT, UNIT_HEIGHT, this.muteButton);

			this.bg.setPosition(CENTER_WIDTH, CENTER_HEIGHT);
			this.bg.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
			this.square.setPosition(CENTER_WIDTH, 5.5 * DOZEN_HEIGHT);
			this.square.setSize(10 * DOZEN_WIDTH, 9 * DOZEN_HEIGHT);
			this.titleText.setPosition(CENTER_WIDTH, 1.75 * DOZEN_HEIGHT);
			this.closeButton.setPosition(CENTER_WIDTH, 11 * DOZEN_HEIGHT);
			paddingTexts(4 * UNIT_HEIGHT, 2 * UNIT_HEIGHT, this.closeButton);
			fontsizeTexts(DOZEN_HEIGHT, this.titleText);
			fontsizeTexts(5 * UNIT_HEIGHT, this.pieceStyleSelectionTileText);
			fontsizeTexts(5 * UNIT_HEIGHT, this.colorPaletteSectionText);
			fontsizeTexts(9 * UNIT_HEIGHT, this.closeButton);
		}
	}
}
